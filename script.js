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
                filteredItems.forEach(item => {
                    const itemElement = document.createElement("div");
                    
                    if (item.category) {
                        // Crear elemento de categoría
                        itemElement.className = "category";
                        itemElement.textContent = item.category;
                    } else {
                        // Crear elemento de enlace normal
                        itemElement.className = "result-item fade-in";
                        itemElement.innerHTML = `
                            <h3><a href="${item.url}" target="_blank">${item.name}</a></h3>
                            <p>${item.description}</p>
                        `;
                    }
                    resultsContainer.appendChild(itemElement);
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
