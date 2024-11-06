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
                resultsContainer.innerHTML = "";
                let currentCategory = null;
                
                filteredItems.forEach(item => {
                    const itemElement = document.createElement("div");

                    if (item.category) {
                        // Si es una categoría, la mostramos
                        const categoryElement = document.createElement("div");
                        categoryElement.className = "category";
                        categoryElement.textContent = item.category;
                        resultsContainer.appendChild(categoryElement);
                        currentCategory = categoryElement;
                    } else {
                        // Si no es una categoría, creamos el item de enlace
                        itemElement.className = "result-item fade-in";
                        itemElement.innerHTML = `
                            <h3><a href="${item.url}" target="_blank">${item.name}</a></h3>
                            <p>${item.description}</p>
                        `;
                        // Si ya hay una categoría actual, la asignamos a este item
                        if (currentCategory) {
                            currentCategory.appendChild(itemElement);
                        } else {
                            resultsContainer.appendChild(itemElement);
                        }
                    }
                });

                // Filtra las categorías vacías
                const categories = document.querySelectorAll(".category");
                categories.forEach(category => {
                    const categoryItems = category.nextElementSibling.querySelectorAll(".result-item");
                    const hasVisibleItems = Array.from(categoryItems).some(item => item.style.display !== "none");
                    
                    if (hasVisibleItems) {
                        category.style.display = "block"; // Muestra la categoría si tiene elementos visibles
                    } else {
                        category.style.display = "none"; // Oculta la categoría si no tiene elementos
                    }
                });
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
