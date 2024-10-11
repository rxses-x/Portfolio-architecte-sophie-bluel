import { fetchData } from "./tools.js"
import { updateGallery } from "./index.js"

let fileData = []

/**
 * Updates and displays a modal with a gallery of images and functionality to delete images.
 * 
 * @param {Response} data - The response object containing the image data (should be a JSON response).
 * @param {string} token - The authentication token for making authorized requests.
 */
async function updateModal(data, token) {
    let modal = document.getElementById('modal');
    if (!modal) {
        modal = document.createElement('aside');
        modal.id = 'modal';
        modal.className = 'modal';
        modal.style.display = 'flex';

        document.body.appendChild(modal);
    } else {
        modal.innerHTML = '';
    }

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';

    const modalBackground = document.createElement('div');
    modalBackground.className = 'modal-background';
    modalBackground.style.display = 'flex'
    modalBackground.addEventListener('click', () => {
        modal.remove()
    })

    const closeModal = document.createElement('span');
    closeModal.className = 'close-modal';
    closeModal.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    const modalTitle = document.createElement('span');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = 'Galerie photo';

    const imageGrid = document.createElement('div');
    imageGrid.className = 'modal-image-grid';
    imageGrid.id = 'modal-image-grid';

    const imageData = await data.json();

    // Loop through the image data and create image elements with delete buttons
    imageData.forEach(image => {
        // Create the image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';

        // Create the img element
        const img = document.createElement('img');
        img.src = image.imageUrl; // Set the image URL
        img.alt = image.title; // Set the alt text
        img.setAttribute("img-id", image.id); // Store image ID in attribute

        // Create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.type = "button";
        deleteButton.setAttribute("img-id", image.id); // Store image ID in attribute
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

        // Add click event listener for delete button
        deleteButton.addEventListener('click', async (event) => {
            event.preventDefault(); // Prevent default button behavior

            // Get the image ID from the button attribute
            const imgId = event.currentTarget.getAttribute('img-id');
            // Send DELETE request to the API to remove the image
            try {
                const response = await fetchData(`works/${imgId}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': '*/*',
                        'Authorization': `Bearer ${token}` // Auth token
                    }
                });

                if (response.ok) {
                    imageContainer.remove();
                    deleteGalleryItem(imgId)
                } else {
                    console.error('Failed to delete the image.');
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        });

        // Append img and delete button to the image container
        imageContainer.appendChild(img);
        imageContainer.appendChild(deleteButton);

        // Append the image container to the image grid
        imageGrid.appendChild(imageContainer);
    });

    // Create separator line
    const separatorLine = document.createElement('hr');
    separatorLine.className = 'separator-line';

    // Create the "Add Photo" button
    const addPhotoButton = document.createElement('button');
    addPhotoButton.className = 'add-photo-button';
    addPhotoButton.textContent = 'Ajouter une photo';
    addPhotoButton.addEventListener('click', () => {
        initializeModal(true);
        modal.style.display = 'none';
        modal.remove()
    });

    modalContainer.appendChild(closeModal);
    modalContainer.appendChild(modalTitle);
    modalContainer.appendChild(imageGrid);
    modalContainer.appendChild(separatorLine);
    modalContainer.appendChild(addPhotoButton);

    modal.appendChild(modalContainer);
    modal.appendChild(modalBackground);

    modal.style.display = 'flex'; // Show the modal
}

// Function to delete an image from the gallery
function deleteGalleryItem(imageId) {
    // Select the gallery container (replace 'galleryContainer' with your actual container ID/class)
    const galleryContainer = document.querySelector('.gallery');

    // Find the image element by img-id attribute
    const imgToDelete = galleryContainer.querySelector(`img[img-id="${imageId}"]`);

    // Check if the image exists
    if (imgToDelete) {
        // Find the figure element that contains the img
        const figureToDelete = imgToDelete.closest('figure');
        
        // Remove the figure from the gallery
        galleryContainer.removeChild(figureToDelete);
    } else {
        console.error('Image not found');
    }
}

/**
 * Updates and displays a modal with a gallery of images and functionality to delete images.
 * 
 * @param {Response} data - The response object containing the image data (should be a JSON response).
 * @param {string} token - The authentication token for making authorized requests.
 */

async function createAddModal(data, token) {
    let addPhotoModal = document.getElementById('modal-add');
    if (!addPhotoModal) {
        addPhotoModal = document.createElement('aside');
        addPhotoModal.id = 'modal-add';
        addPhotoModal.className = 'modal';
        addPhotoModal.style.display = 'flex';

        // Append the modal to the document body
        document.body.appendChild(addPhotoModal);
    } else {
        // If the modal exists, clear its current content
        addPhotoModal.innerHTML = '';
        addPhotoModal.style.display = 'flex'; // Show the modal
    }

    const addPhotoModalContainer = document.createElement('div');
    addPhotoModalContainer.className = 'modal-container';

    const modalBackground = document.createElement('div');
    modalBackground.className = 'modal-background';
    modalBackground.style.display = 'flex'
    modalBackground.addEventListener('click', () => {
        addPhotoModal.remove()
    })

    const closeAddPhotoModal = document.createElement('span');
    closeAddPhotoModal.className = 'close-modal';
    closeAddPhotoModal.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeAddPhotoModal.addEventListener('click', (event) => {
        addPhotoModal.remove()
    });

    const previousAddPhotoModal = document.createElement('span');
    previousAddPhotoModal.className = 'previous-modal';
    previousAddPhotoModal.innerHTML = '<i class="fa-solid fa-left-long"></i>';
    previousAddPhotoModal.addEventListener('click', () => {
        addPhotoModal.remove()
        initializeModal()
    });

    // Create the title for the modal
    const modalTitle = document.createElement('span');
    modalTitle.textContent = 'Ajout photo';
    modalTitle.className = 'modal-title';

    // Create the image placeholder
    const uploadArea = document.createElement('div');
    uploadArea.className = 'upload-area';

    // Image icon placeholder
    const imgPlaceholder = document.createElement('div');
    imgPlaceholder.className = 'img-placeholder';

    uploadArea.appendChild(imgPlaceholder);

    // If you want an icon as a fallback (like in your example)
    const iconElement = document.createElement('span');
    iconElement.innerHTML = '<i class="fa-regular fa-image"></i>';
    imgPlaceholder.appendChild(iconElement);

    // If you want an icon as a fallback (like in your example)
    const imageContainer = document.createElement('img');
    imageContainer.id = "image-preview"
    imageContainer.className = "image-preview"
    imageContainer.style.display = false
    uploadArea.appendChild(imageContainer);

    // Create upload button (inside the upload area)
    const uploadButton = document.createElement('button');
    uploadButton.className = 'add-photo-button2';
    uploadButton.textContent = '+ Ajouter photo';
    uploadButton.classList.add("background-blue")

    // File input for the photo
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg, image/png';
    fileInput.style.display = 'none'; // Hidden input field

    uploadButton.addEventListener('click', () => {
        fileInput.click(); // Trigger file input when button is clicked
    });

    // Add file input to the DOM (hidden)
    imgPlaceholder.appendChild(uploadButton);
    imgPlaceholder.appendChild(fileInput);

    // Create instructions text (jpg, png: 4mo max)
    const instructions = document.createElement('p');
    instructions.textContent = 'jpg, png : 4mo max';
    instructions.className = 'upload-instructions';
    imgPlaceholder.appendChild(instructions);

    // Create the 'Titre' field
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Titre';
    titleLabel.className = 'form-label';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Entrez un titre';
    titleInput.className = 'form-input';

    titleInput.addEventListener('input', updateSubmitButtonState); // Update button state on input

    // Create the 'Catégorie' field
    const categoryLabel = document.createElement('label');
    categoryLabel.textContent = 'Catégorie';
    categoryLabel.className = 'form-label';

    const categorySelect = document.createElement('select');
    categorySelect.className = 'form-select';

    // Add categories as options

    const categoriesData = await data.json()

    categoriesData.forEach(categories => {
        const category = document.createElement('option');
        category.value = `${categories.id}`;
        category.text = categories.name;
        
        categorySelect.appendChild(category)
    })
    // Create the separator line
    const separatorLine = document.createElement('hr');
    separatorLine.className = 'separator-line';

    // Create the 'Valider' button
    const submitButton = document.createElement('button');
    submitButton.className = 'validate-button';
    submitButton.textContent = 'Valider';
    submitButton.disabled = true; // Initially disabled

    // Function to check and update the submit button state
    function updateSubmitButtonState() {
        const isTitleNotEmpty = titleInput.value.trim() !== '';
        const isFileSelected = fileData.length > 0; // Check if any files are selected

        if (isTitleNotEmpty && isFileSelected) {
            submitButton.classList.add('enabled'); // Add the 'enabled' class
            submitButton.disabled = false; // Enable the button
        } else {
            submitButton.classList.remove('enabled'); // Remove the 'enabled' class
            submitButton.disabled = true; // Disable the button
        }
    }

    // Handle file selection and image preview
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]; // Get the selected file
        
        if (file) {
            // Limit file size to 4MB (4 Mo)
            const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes

            if (file.size > MAX_FILE_SIZE) {
                alert('The selected file exceeds the 4MB size limit. Please choose a smaller file.');
                return; // Exit early if the file is too large
            }

            const reader = new FileReader();
            
            reader.onload = (e) => {
                // Load the file and show the image preview
                fileData.push(file);
                imageContainer.style.display = 'block';
                imageContainer.src = e.target.result; // Show the preview image
                imgPlaceholder.style.display = 'none'; // Hide the placeholder
                updateSubmitButtonState();
            };

            reader.readAsDataURL(file); // Read the image file as a data URL
        }
    });

    submitButton.addEventListener('click', async () => {
        // Prepare the form data to be sent via POST
        const formData = new FormData();

        formData.append('image', fileData[0]);
        formData.append('title', titleInput.value);
        formData.append('category', categorySelect.value);

        // Send the form data via POST request
        try {
            const response = await fetchData('works', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });


            if (!response.ok) {
                // Check for server errors, such as 500 or other status codes
                const errorData = await response.json();
                console.error('Server Error:', errorData);
                throw new Error(`Server responded with status ${response.status}: ${response.statusText}`);
            }
            const responseData = await response.json();
            addNewImage(responseData)
        } catch (error) {
            console.error('Request failed:', error.message);
        }

        // After submission logic (e.g., API call), clear the form fields
        imageContainer.src = ''
        imageContainer.style.display = 'none';
        imgPlaceholder.style.display = 'flex'; // Hide the placeholder
        titleInput.value = '';        // Clear title input
        categorySelect.value = 1;    // Reset category selection to the first option
        fileInput.value = '';         // Assuming fileInput is the input element for file uploads
        addPhotoModal.remove()
        // addPhotoModal.style.display = 'none';
    })

    // Append the upload area, title input, category input, and submit button to the modal container
    addPhotoModalContainer.appendChild(closeAddPhotoModal);
    addPhotoModalContainer.appendChild(previousAddPhotoModal);
    addPhotoModalContainer.appendChild(modalTitle);
    addPhotoModalContainer.appendChild(uploadArea);
    addPhotoModalContainer.appendChild(titleLabel);
    addPhotoModalContainer.appendChild(titleInput);
    addPhotoModalContainer.appendChild(categoryLabel);
    addPhotoModalContainer.appendChild(categorySelect);
    addPhotoModalContainer.appendChild(separatorLine);
    addPhotoModalContainer.appendChild(submitButton);

    // Append the new modal container to the new modal
    addPhotoModal.appendChild(addPhotoModalContainer);
    addPhotoModal.appendChild(modalBackground);

    // Append the new modal to the body
    document.body.appendChild(addPhotoModal);
}

export async function initializeModal(bool) {
    const token = sessionStorage.getItem("Token");
    const galleryData = await fetchData('works');
    const categoryData = await fetchData('categories');
    if (bool) {
        createAddModal(categoryData, token)
    } else {
        updateModal(galleryData, token);
    }
}

// Async function to add a new image to the gallery
async function addNewImage(tblData) {
    // Select the gallery container
    const galleryContainer = document.querySelector(".gallery");

    // If gallery container doesn't exist, exit the function early
    if (!galleryContainer) return;

    try {
        // Create a DocumentFragment for optimized DOM manipulation
        const fragment = document.createDocumentFragment();

        // Helper function to create a new gallery item (figure element)
        function createGalleryItem(data) {
            // Create a figure element
            const figure = document.createElement('figure');
        
            // Create and set up the img element
            const img = document.createElement('img');
            img.src = data.imageUrl;  // Set image source URL
            img.alt = data.title;     // Set image alt text
        
            // Create and set the figcaption (image title)
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = data.title;
        
            // Append img and figcaption to the figure element
            figure.appendChild(img);
            figure.appendChild(figcaption);
        
            // Return the fully constructed figure element
            return figure;
        }

        // Create a new gallery item using the provided data
        const figure = createGalleryItem(tblData);
        // Append the figure to the fragment for efficient DOM insertion
        fragment.appendChild(figure);

        // Append the fragment to the gallery container in one operation
        galleryContainer.appendChild(fragment);
    } catch (error) {
        // Log any errors encountered during the process
        console.error('Error updating gallery:', error);
    }
}