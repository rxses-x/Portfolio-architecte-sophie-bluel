import { initializeModal } from "./modal.js"
import { fetchData } from "./tools.js"

/**
 * Updates the gallery container with new gallery items based on the provided data and category.
 * @param {Response} data - The response object containing gallery data.
 * @param {number|null} category - The category ID to filter the gallery items by (optional).
 */
async function updateGallery(data, category = null) {
    const galleryContainer = document.querySelector(".gallery");

    // If gallery container doesn't exist, exit the function
    if (!galleryContainer) return;

    // Clear the gallery before adding new elements
    galleryContainer.innerHTML = '';

    try {
        // Parse the response data as JSON
        const galleryData = await data.json();

        // Filter gallery items based on the selected category
        const filteredGallery = galleryData.filter(gallery => category === null || gallery.categoryId == category);

        // Use DocumentFragment to batch DOM updates for better performance
        const fragment = document.createDocumentFragment();

        // Create and append each gallery item to the fragment
        filteredGallery.forEach(gallery => {
            const figure = createGalleryItem(gallery);
            fragment.appendChild(figure);
        });

        // Append the entire fragment to the gallery container
        galleryContainer.appendChild(fragment);
    } catch (error) {
        // Log any error that occurs during the process
        console.error('Error updating gallery:', error);
    }
}

/**
 * Creates a DOM element representing a gallery item (figure) with an image and caption.
 * @param {Object} gallery - An object containing the gallery item's data (imageUrl, title, etc.).
 * @returns {HTMLElement} - A figure element containing an image and a caption.
 */
function createGalleryItem(gallery) {
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

    return figure;
}

/**
 * Initializes the filter buttons based on categories fetched from the API and sets up event listeners for filtering gallery items.
 */
async function initializeFilters() {
    try {
        // Fetch category data from the API
        const categories = await fetchData('categories');
        const categoriesData = await categories.json(); // Parse the JSON data

        // Select the filters container from the DOM
        const filtersContainer = document.querySelector(".filters");

        // Check if the filters container exists
        if (!filtersContainer) return;

        // Clear existing filters
        filtersContainer.innerHTML = '';

        // Create a DocumentFragment to batch DOM updates
        const fragment = document.createDocumentFragment();

        // Add "Tous" button (show all)
        fragment.appendChild(createFilterButton('Tous', 'null', true));

        // Add category buttons
        categoriesData.forEach(category => {
            fragment.appendChild(createFilterButton(category.name, category.id));
        });

        // Append all buttons to the filters container at once
        filtersContainer.appendChild(fragment);

        // Add event listener for filter buttons
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

        // Call the function to load gallery items based on the selected category
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

    // If token exists, show 'logout' and handle logout behavior
    if (token) {
        navLoginLink.innerHTML = "logout";
        navLoginLink.href = "#";

        navLoginLink.addEventListener("click", function () {
            sessionStorage.removeItem("Token"); // Clear the token on logout
            navLoginLink.innerHTML = "login";
            navLoginLink.href = "./index.html"; // Redirect to the home page
        });
    } else {
        // If no token, show 'login'
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
        // Show edit options and modify the layout for logged-in users
        editBar.style.display = 'flex';
        header.style.marginTop = '88px';
        filters.style.display = "none";
        editPortfolioButton.style.display = "flex";

        editPortfolioButton.addEventListener("click", function() {
            initializeModal()
        } );
    } else {
        // Hide the edit bar if not logged in
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