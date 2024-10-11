import { fetchData } from "./tools.js"

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
        modal.style.display = 'flex';
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

    imageData.forEach(image => {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';

        const img = document.createElement('img');
        img.src = image.imageUrl;
        img.alt = image.title;
        img.setAttribute("img-id", image.id);

        const deleteButton = document.createElement('button');
        deleteButton.type = "button";
        deleteButton.setAttribute("img-id", image.id);
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

        // Add click event listener for delete button
        deleteButton.addEventListener('click', async (event) => {
            event.preventDefault();

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

        imageContainer.appendChild(img);
        imageContainer.appendChild(deleteButton);

        imageGrid.appendChild(imageContainer);
    });

    const separatorLine = document.createElement('hr');
    separatorLine.className = 'separator-line';

    const addPhotoButton = document.createElement('button');
    addPhotoButton.className = 'add-photo-button';
    addPhotoButton.textContent = 'Ajouter une photo';
    addPhotoButton.addEventListener('click', () => {
        initializeModal(true);
        modal.remove()
    });

    modalContainer.appendChild(closeModal);
    modalContainer.appendChild(modalTitle);
    modalContainer.appendChild(imageGrid);
    modalContainer.appendChild(separatorLine);
    modalContainer.appendChild(addPhotoButton);

    modal.appendChild(modalContainer);
    modal.appendChild(modalBackground);
}

/**
 * Deletes a gallery item from the DOM based on the provided image ID.
 *
 * @param {string} imageId - The ID of the image to be deleted. 
 *                           This should match the value of the `img-id` attribute
 *                           on the image element within the gallery.
 *
 * The function searches for the image element with the corresponding `img-id`
 * attribute and removes its parent `<figure>` element from the gallery container.
 * If the image is not found, an error message is logged to the console.
 */
function deleteGalleryItem(imageId) {
    const galleryContainer = document.querySelector('.gallery');

    // Find the image element by img-id attribute
    const imgToDelete = galleryContainer.querySelector(`img[img-id="${imageId}"]`);

    if (imgToDelete) {
        const figureToDelete = imgToDelete.closest('figure');
        
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

        document.body.appendChild(addPhotoModal);
    } else {
        addPhotoModal.innerHTML = '';
        addPhotoModal.style.display = 'flex';
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

    const modalTitle = document.createElement('span');
    modalTitle.textContent = 'Ajout photo';
    modalTitle.className = 'modal-title';

    const uploadArea = document.createElement('div');
    uploadArea.className = 'upload-area';

    const imgPlaceholder = document.createElement('div');
    imgPlaceholder.className = 'img-placeholder';

    uploadArea.appendChild(imgPlaceholder);

    const iconElement = document.createElement('span');
    iconElement.innerHTML = '<i class="fa-regular fa-image"></i>';
    imgPlaceholder.appendChild(iconElement);

    const imageContainer = document.createElement('img');
    imageContainer.id = "image-preview"
    imageContainer.className = "image-preview"
    imageContainer.style.display = false
    uploadArea.appendChild(imageContainer);

    const uploadButton = document.createElement('button');
    uploadButton.className = 'add-photo-button2';
    uploadButton.textContent = '+ Ajouter photo';
    uploadButton.classList.add("background-blue")

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg, image/png';
    fileInput.style.display = 'none';

    uploadButton.addEventListener('click', () => {
        fileInput.click(); // Trigger file input when button is clicked
    });

    imgPlaceholder.appendChild(uploadButton);
    imgPlaceholder.appendChild(fileInput);

    // Create instructions text (jpg, png: 4mo max)
    const instructions = document.createElement('p');
    instructions.textContent = 'jpg, png : 4mo max';
    instructions.className = 'upload-instructions';
    imgPlaceholder.appendChild(instructions);

    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Titre';
    titleLabel.className = 'form-label';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Entrez un titre';
    titleInput.className = 'form-input';

    titleInput.addEventListener('input', updateSubmitButtonState);

    const categoryLabel = document.createElement('label');
    categoryLabel.textContent = 'Catégorie';
    categoryLabel.className = 'form-label';

    const categorySelect = document.createElement('select');
    categorySelect.className = 'form-select';

    const categoriesData = await data.json()

    categoriesData.forEach(categories => {
        const category = document.createElement('option');
        category.value = `${categories.id}`;
        category.text = categories.name;
        
        categorySelect.appendChild(category)
    })

    const separatorLine = document.createElement('hr');
    separatorLine.className = 'separator-line';

    const submitButton = document.createElement('button');
    submitButton.className = 'validate-button';
    submitButton.textContent = 'Valider';
    submitButton.disabled = true; // Initially disabled

    // Function to check and update the submit button state
    function updateSubmitButtonState() {
        const isTitleNotEmpty = titleInput.value.trim() !== '';
        const isFileSelected = fileData.length > 0; // Check if any files are selected

        if (isTitleNotEmpty && isFileSelected) {
            submitButton.classList.add('enabled');
            submitButton.disabled = false;
        } else {
            submitButton.classList.remove('enabled');
            submitButton.disabled = true;
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
                imgPlaceholder.style.display = 'none';
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
        imgPlaceholder.style.display = 'flex';
        titleInput.value = '';
        categorySelect.value = 1;
        fileInput.value = '';
        addPhotoModal.remove()
        // addPhotoModal.style.display = 'none';
    })

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

    addPhotoModal.appendChild(addPhotoModalContainer);
    addPhotoModal.appendChild(modalBackground);

    document.body.appendChild(addPhotoModal);
}

/**
 * Initializes the modal based on the provided boolean value.
 *
 * @param {boolean} bool - Determines which modal to create:
 *                         - If true, calls createAddModal to set up the modal for adding new items.
 *                         - If false, calls updateModal to display existing gallery items.
 * 
 * @returns {Promise<void>} - A promise that resolves when the modal initialization is complete.
 */
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

/**
 * Adds a new image to the gallery.
 *
 * @param {Object} tblData - The data for the new image to be added.
 * @param {string} tblData.imageUrl - The URL of the image.
 * @param {string} tblData.title - The title of the image.
 *
 * @returns {Promise<void>} - A promise that resolves when the image has been added to the gallery.
 */
async function addNewImage(tblData) {
    const galleryContainer = document.querySelector(".gallery");

    if (!galleryContainer) return;

    try {
        // Create a DocumentFragment for optimized DOM manipulation
        const fragment = document.createDocumentFragment();

        // Helper function to create a new gallery item (figure element)
        function createGalleryItem(data) {
            const figure = document.createElement('figure');
        
            const img = document.createElement('img');
            img.src = data.imageUrl;
            img.alt = data.title;
            img.setAttribute("img-id", data.id);
        
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = data.title;
        
            figure.appendChild(img);
            figure.appendChild(figcaption);
        
            // Return the fully constructed figure element
            return figure;
        }

        const figure = createGalleryItem(tblData);
        fragment.appendChild(figure);

        galleryContainer.appendChild(fragment);
    } catch (error) {
        // Log any errors encountered during the process
        console.error('Error updating gallery:', error);
    }
}