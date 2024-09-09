const api = "http://localhost:5678/api/"

async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}

function updateGallery(data, category = null) {
    const galleryContainer = document.querySelector(".gallery");
    galleryContainer.innerHTML = ''; // Clear the gallery before adding new elements

    data.forEach(gallery => {
        if (category === null || gallery.categoryId == category) {
            galleryContainer.innerHTML += `
                <figure>
                    <img src="${gallery.imageUrl}" alt="${gallery.title}">
                    <figcaption>${gallery.title}</figcaption>
                </figure>`;
        }
    });
}

async function initializeFilters() {
    const categories = await fetchData(`${api}categories`);
    const filtersContainer = document.querySelector(".filters");

    // Create and append the "Tous" button
    filtersContainer.innerHTML = `<button class="active" data-id="null">Tous</button>`;

    // Create and append the category buttons
    categories.forEach(category => {
        filtersContainer.innerHTML += `<button class="category-btn" data-id="${category.id}">${category.name}</button>`;
    });

    // Add event listener for filter buttons
    filtersContainer.addEventListener("click", function (event) {
        if (event.target.tagName === 'BUTTON') {
            // Remove active class from all buttons and add to the clicked one
            document.querySelector(".filters .active").classList.remove('active');
            event.target.classList.add('active');

            // Load gallery items based on selected category
            const categoryId = event.target.dataset.id === "null" ? null : event.target.dataset.id;
            initializeGallery(categoryId);
        }
    });
}

async function initializeGallery(category = null) {
    const galleryData = await fetchData(`${api}works`);
    updateGallery(galleryData, category);
}


function loadAdminTools() {

}

function updateNavMenu() {
    const token = sessionStorage.getItem("Token");
    const navLoginLink = document.querySelector('nav ul li a[href="./login.html"]');
    
    if (token && navLoginLink) {
        navLoginLink.innerHTML = "logout"
        loadAdminTools()

        navLoginLink.addEventListener("click", function() {
            navLoginLink.innerHTML = "login";
            navLoginLink.href = "./index.html";
            sessionStorage.removeItem("Token"); // Clear the token on logout
        })
    } else {
        navLoginLink.innerHTML = "login";
        navLoginLink.href = "./login.html";
    }
}

// Initialize the application
initializeFilters();
initializeGallery();
updateNavMenu();