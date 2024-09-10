import { initializeModal } from "./modal.js"

const api = "http://localhost:5678/api/"

async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}

function updateGallery(data, category = null) {
    const galleryContainer = document.querySelector(".gallery");
    galleryContainer.innerHTML = ''; // Clear the gallery before adding new elements

    data
        .filter(gallery => category === null || gallery.categoryId == category)
        .forEach(gallery => {
            // Create figure element
            const figure = document.createElement('figure');

            // Create img element
            const img = document.createElement('img');
            img.src = gallery.imageUrl;
            img.alt = gallery.title;

            // Create figcaption element
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = gallery.title;

            // Append img and figcaption to figure
            figure.appendChild(img);
            figure.appendChild(figcaption);

            // Append figure to galleryContainer
            galleryContainer.appendChild(figure);
        });
}

async function initializeFilters() {
    const categories = await fetchData(`${api}categories`);
    const filtersContainer = document.querySelector(".filters");

    filtersContainer.innerHTML = '';
    // Create and append the "Tous" button
    const button = document.createElement("button")
    button.className = 'active'; // Set the class
    button.setAttribute('data-id', 'null'); // Set the data-id attribute
    button.textContent = 'Tous'; // Set the button text


    filtersContainer.appendChild(button);

    // Create and append the category buttons
    categories.forEach(category => {
        const button = document.createElement("button")
        button.className = 'category-btn'; // Set the class
        button.setAttribute('data-id', category.id); // Set the data-id attribute
        button.textContent = category.name; // Set the button text
        filtersContainer.appendChild(button);
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

function updateNavMenu() {
    const token = sessionStorage.getItem("Token");
    const navLoginLink = document.querySelector('nav ul li a[href="./login.html"]');

    if (token && navLoginLink) {
        navLoginLink.innerHTML = "logout"

        navLoginLink.addEventListener("click", function () {
            navLoginLink.innerHTML = "login";
            navLoginLink.href = "./index.html";
            sessionStorage.removeItem("Token"); // Clear the token on logout
        })
    } else {
        navLoginLink.innerHTML = "login";
        navLoginLink.href = "./login.html";
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    // Check if user is logged in
    const token = sessionStorage.getItem("Token");
    const editBar = document.querySelector('.banner-edit');
    const header = document.querySelector('header');
    const filters = document.querySelector('.filters');
    const portfolio = document.getElementById("portfolio");
    const edit_portfolio = document.querySelector('.edit-portfolio');

    if (token) {
        // Show the edit bar if logged in
        editBar.style.display = 'flex';
        header.style.marginTop = '88px';
        filters.style.display = "none"
        edit_portfolio.style.display = "flex"

        edit_portfolio.addEventListener("click", function () {
            initializeModal()
        });

    } else {
        // Hide the edit bar if not logged in
        editBar.style.display = 'none';
    }
});

// Initialize the application
initializeFilters();
initializeGallery();
updateNavMenu();