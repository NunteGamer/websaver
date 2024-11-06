document.addEventListener("DOMContentLoaded", function () {
    const resultsContainer = document.getElementById("results");
    const searchBar = document.getElementById("search-bar");

    fetch("sitios.csv")
        .then(response => response.text())
        .then(data => {
            const rows = data.trim().split("\n").slice(1); // Saltamos la primera línea de encabezados
            const items = rows.map(row => {
                const [name, url, description, tags] = row.split(",");
                
                // Verificar si es una categoría (solo texto rodeado por asteriscos)
                if (name.startsWith("*") && name.endsWith("*") && !url && !description && !tags) {
                    return { category: name.slice(1, -1).trim() }; // Eliminar asteriscos y espacios
                }

                return { name, url, description, tags: tags ? tags.split(".") : [] };
            });

            function displayResults(filteredItems) {
                resultsContainer.innerHTML = ""; // Limpiamos los resultados anteriores
                let currentCategory = null;
                let currentCategoryContainer = null;

                if (filteredItems.length === 0) {
                    const noResultsMessage = document.createElement("div");
                    noResultsMessage.className = "no-results-message";
                    noResultsMessage.textContent = "Parece que no hay nada por aquí.";
                    resultsContainer.appendChild(noResultsMessage);
                    return; // Salimos de la función si no hay resultados
                }

                let hasVisibleResults = false;

                filteredItems.forEach(item => {
                    const itemElement = document.createElement("div");

                    if (item.category) {
                        // Si es una categoría, la mostramos
                        currentCategoryContainer = document.createElement("div");
                        currentCategoryContainer.className = "category-container";
                        const categoryElement = document.createElement("div");
                        categoryElement.className = "category";
                        categoryElement.textContent = item.category;
                        currentCategoryContainer.appendChild(categoryElement);
                        resultsContainer.appendChild(currentCategoryContainer);
                        currentCategory = categoryElement;
                    } else {
                        // Si no es una categoría, creamos el item de enlace
                        itemElement.className = "result-item fade-in";
                        itemElement.innerHTML = `
                            <h3><a href="${item.url}" target="_blank">${item.name}</a></h3>
                            <p>${item.description}</p>
                        `;
                        // Si ya hay una categoría actual, la asignamos a este item
                        if (currentCategoryContainer) {
                            currentCategoryContainer.appendChild(itemElement);
                        } else {
                            resultsContainer.appendChild(itemElement);
                        }

                        hasVisibleResults = true;
                    }
                });

                // Filtra las categorías vacías
                const categories = document.querySelectorAll(".category-container");
                categories.forEach(categoryContainer => {
                    const categoryItems = categoryContainer.querySelectorAll(".result-item");
                    const hasVisibleItems = Array.from(categoryItems).some(item => item.style.display !== "none");
                    
                    if (hasVisibleItems) {
                        categoryContainer.style.display = "block"; // Muestra la categoría si tiene elementos visibles
                    } else {
                        categoryContainer.style.display = "none"; // Oculta la categoría si no tiene elementos
                    }
                });

                // Si no hay resultados visibles, mostramos el mensaje de "no hay resultados"
                if (!hasVisibleResults) {
                    const noResultsMessage = document.createElement("div");
                    noResultsMessage.className = "no-results-message";
                    noResultsMessage.textContent = "Parece que no hay nada por aquí.";
                    resultsContainer.appendChild(noResultsMessage);
                }
            }

            // Mostrar todos los resultados inicialmente
            displayResults(items);

            searchBar.addEventListener("input", function () {
                const query = searchBar.value.toLowerCase();
                const filteredItems = items.filter(item => {
                    if (item.category) return true; // Las categorías siempre se muestran
                    return item.name.toLowerCase().includes(query) ||
                           item.description.toLowerCase().includes(query) ||
                           (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)));
                });
                displayResults(filteredItems);
            });
        })
        .catch(error => console.error("Error cargando el CSV:", error));
});
