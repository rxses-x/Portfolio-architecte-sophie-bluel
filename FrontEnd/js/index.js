import { initializeModal } from "./modal.js"
import { fetchData } from "./tools.js"

/**
 * Updates the gallery container with new gallery items based on the provided data and category.
 * @param {Response} data - The response object containing gallery data.
 * @param {number|null} category - The category ID to filter the gallery items by (optional).
 */
export async function updateGallery(data, category = null) {
    const galleryContainer = document.querySelector(".gallery");

    if (!galleryContainer) return;

    galleryContainer.innerHTML = '';

    try {
        // Parse the response data as JSON
        const galleryData = await data.json();

        // Filter gallery items based on the selected category
        const filteredGallery = galleryData.filter(gallery => category === null || gallery.categoryId == category);

        // Use DocumentFragment to batch DOM updates for better performance
        const fragment = document.createDocumentFragment();

        filteredGallery.forEach(gallery => {
            const figure = createGalleryItem(gallery);
            fragment.appendChild(figure);
        });

        galleryContainer.appendChild(fragment);
    } catch (error) {
        console.error('Error updating gallery:', error);
    }
}

/**
 * Creates a DOM element representing a gallery item (figure) with an image and caption.
 * @param {Object} gallery - An object containing the gallery item's data (imageUrl, title, etc.).
 * @returns {HTMLElement} - A figure element containing an image and a caption.
 */
function createGalleryItem(gallery) {
    const figure = document.createElement('figure');

    const img = document.createElement('img');
    img.src = gallery.imageUrl;
    img.alt = gallery.title;
    img.setAttribute("img-id", gallery.id); // Store image ID in attribute

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = gallery.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    return figure;
}

/**
 * Initializes the filter buttons based on categories fetched from the API and sets up event listeners for filtering gallery items.
 */
async function initializeFilters() {
    try {
        const categories = await fetchData('categories');
        const categoriesData = await categories.json(); // Parse the JSON data

        const filtersContainer = document.querySelector(".filters");

        if (!filtersContainer) return;

        filtersContainer.innerHTML = '';

        const fragment = document.createDocumentFragment();

        // Add "Tous" button (show all)
        fragment.appendChild(createFilterButton('Tous', 'null', true));

        categoriesData.forEach(category => {
            fragment.appendChild(createFilterButton(category.name, category.id));
        });

        filtersContainer.appendChild(fragment);

        filtersContainer.addEventListener("click", handleFilterClick);
    } catch (error) {
        console.error('Error initializing filters:', error);
    }
}

/**
 * Creates a filter button with the given name, data-id, and an optional active class.
 * @param {string} name - The text to display on the button.
 * @param {string|number} id - The data-id to associate with the button (category ID).
 * @param {boolean} [isActive=false] - Whether the button should be marked as active.
 * @returns {HTMLElement} - The created button element.
 */
function createFilterButton(name, id, isActive = false) {
    const button = document.createElement('button');
    button.className = isActive ? 'active' : ''; // Add 'active' class if needed
    button.setAttribute('data-id', id); // Set the data-id attribute
    button.textContent = name; // Set the button text
    return button;
}

/**
 * Handles the filter button click event, updating the active button and filtering gallery items.
 * @param {Event} event - The click event.
 */
function handleFilterClick(event) {
    if (event.target.tagName === 'BUTTON') {
        const activeButton = document.querySelector(".filters .active");

        // Remove 'active' class from the current active button
        if (activeButton) activeButton.classList.remove('active');

        // Add 'active' class to the clicked button
        event.target.classList.add('active');

        // Get the category ID from the clicked button
        const categoryId = event.target.dataset.id === "null" ? null : event.target.dataset.id;

        initializeGallery(categoryId);
    }
}

/**
 * Initializes the gallery by fetching works data from the API and updating the gallery items based on the selected category.
 * @param {number|null} [category=null] - The category ID to filter the gallery items by (optional, defaults to null for all categories).
 */
async function initializeGallery(category = null) {
    try {
        const galleryData = await fetchData('works');
        updateGallery(galleryData, category);
    } catch (error) {
        console.error('Error initializing gallery:', error);
    }
}

/**
 * Updates the navigation menu to display 'login' or 'logout' based on the presence of a session token.
 * Handles the logout process by removing the session token and updating the link.
 */
function updateNavMenu() {
    const token = sessionStorage.getItem("Token");
    const navLoginLink = document.querySelector('nav ul li a[href="./login.html"]');

    if (!navLoginLink) return;

    if (token) {
        navLoginLink.innerHTML = "logout";
        navLoginLink.href = "#";

        navLoginLink.addEventListener("click", function () {
            sessionStorage.removeItem("Token");
            navLoginLink.innerHTML = "login";
            navLoginLink.href = "./index.html";
        });
    } else {
        navLoginLink.innerHTML = "login";
        navLoginLink.href = "./login.html";
    }
}

/**
 * Checks if the user is logged in and updates the page accordingly by showing or hiding the edit bar,
 * adjusting layout, and adding event listeners to edit the portfolio.
 */
function updatePageForLoggedInUser() {
    const token = sessionStorage.getItem("Token");
    const editBar = document.querySelector('.banner-edit');
    const header = document.querySelector('header');
    const filters = document.querySelector('.filters');
    const portfolio = document.getElementById("portfolio");
    const editPortfolioButton = document.querySelector('.edit-portfolio');

    if (!header || !filters || !portfolio || !editBar || !editPortfolioButton) return;

    if (token) {
        editBar.style.display = 'flex';
        header.style.marginTop = '88px';
        filters.style.display = "none";
        editPortfolioButton.style.display = "flex";

        editPortfolioButton.addEventListener("click", function() {
            initializeModal()
        } );
    } else {
        editBar.style.display = 'none';
    }
}

// Event listener to check user login status when the page loads
window.addEventListener('DOMContentLoaded', () => {
    updatePageForLoggedInUser();
    initializeFilters();
    initializeGallery();
    updateNavMenu();
});