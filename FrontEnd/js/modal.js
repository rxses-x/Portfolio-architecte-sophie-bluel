import { fetchData } from "./tools.js"

let fileData = []

/**
 * Updates and displays a modal with a gallery of images and functionality to delete images.
 * 
 * @param {Response} data - The response object containing the image data (should be a JSON response).
 * @param {string} token - The authentication token for making authorized requests.
 */
async function updateModal(data, token) {
    // Create the modal <aside> element
    const modal = document.createElement('aside');
    modal.id = 'modal';
    modal.className = 'modal';
    modal.style.display = 'flex'; // Show the modal

    // Create container for modal content
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';

    // Create and configure the close button
    const closeModal = document.createElement('span');
    closeModal.className = 'close-modal';
    closeModal.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none'; // Hide modal on close button click
    });

    // Create and set the modal title
    const modalTitle = document.createElement('span');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = 'Galerie photo';

    // Create the image grid container
    const imageGrid = document.createElement('div');
    imageGrid.className = 'modal-image-grid';
    imageGrid.id = 'modal-image-grid';

    // Parse the image data from the response
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
                console.log(`Image with ID ${imgId} was deleted.`);
                imageContainer.remove();
                const response = await fetchData(`works/${imgId}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': '*/*',
                        'Authorization': `Bearer ${token}` // Auth token
                    }
                });

                if (response.ok) {
                    console.log(`Image with ID ${imgId} was deleted.`);
                    // Remove the image container from the DOM
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
        initializeModal(true); // Initialize the modal for adding a photo
        modal.style.display = 'none'; // Hide the current modal
    });

    // Append all elements to the modal container
    modalContainer.appendChild(closeModal);       // Close button
    modalContainer.appendChild(modalTitle);       // Modal title
    modalContainer.appendChild(imageGrid);        // Image grid
    modalContainer.appendChild(separatorLine);    // Separator line
    modalContainer.appendChild(addPhotoButton);   // Add photo button

    // Append the modal container to the modal
    modal.appendChild(modalContainer);

    // Append the modal to the document body
    document.body.appendChild(modal);

    // Make sure the modal is visible
    modal.style.display = 'flex';
}

/**
 * Updates and displays a modal with a gallery of images and functionality to delete images.
 * 
 * @param {Response} data - The response object containing the image data (should be a JSON response).
 * @param {string} token - The authentication token for making authorized requests.
 */

async function createAddModal(data, token) {
    // Create a new modal for adding a photo
    const addPhotoModal = document.createElement('aside');
    addPhotoModal.className = 'modal';
    addPhotoModal.style.display = 'flex'; // Make the modal visible

    // Close the new modal on background click
   /*  addPhotoModal.addEventListener('click', () => {
        addPhotoModal.style.display = 'none';
    }); */

    // Create the modal container
    const addPhotoModalContainer = document.createElement('div');
    addPhotoModalContainer.className = 'modal-container';

    // Create the close button for the new modal
    const closeAddPhotoModal = document.createElement('span');
    closeAddPhotoModal.className = 'close-modal';
    closeAddPhotoModal.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeAddPhotoModal.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent modal close when clicking inside the modal content
        addPhotoModal.style.display = 'none';
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
    
    // Create an image element
    const imgElement = document.createElement('img');
    imgElement.className = 'image-preview';
    imgElement.alt = 'Image Preview';
    imgElement.style.maxWidth = '100%';
    imgElement.style.height = 'auto';

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

                // Re-enable the submit button after the image is loaded
                submitButton.classList.add('enabled'); // Add the 'enabled' class
                submitButton.disabled = false;
                console.log('Submit button enabled:', submitButton.disabled); // Check that it's now enabled
            };

            reader.readAsDataURL(file); // Read the image file as a data URL
        }
    });

    submitButton.addEventListener('click', async () => {
        // Prepare the form data to be sent via POST
        const formData = new FormData();

        formData.append('imageUrl', fileData[0]);
        formData.append('title', titleInput.value);
        formData.append('categoryId', categorySelect.selectedIndex);

        console.log('formData', formData)

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

            console.log('RESPONSE:', response)

            if (!response.ok) {
                // Check for server errors, such as 500 or other status codes
                const errorData = await response.json();
                console.error('Server Error:', errorData);
                throw new Error(`Server responded with status ${response.status}: ${response.statusText}`);
            }
            const responseData = await response.json();
            console.log('Success:', responseData);
        } catch (error) {
            console.error('Request failed:', error.message);
        }

        // After submission logic (e.g., API call), clear the form fields
        imageContainer.style.display = 'none';
        imgPlaceholder.style.display = 'flex'; // Hide the placeholder
        imageContainer.src = ''
        titleInput.value = '';        // Clear title input
        categorySelect.selectedIndex = 0;    // Reset category selection to the first option
        fileInput.value = '';         // Assuming fileInput is the input element for file uploads
    })

    // Append the upload area, title input, category input, and submit button to the modal container
    addPhotoModalContainer.appendChild(closeAddPhotoModal);
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

    // Append the new modal to the body
    document.body.appendChild(addPhotoModal);

    // Show the new modal
    addPhotoModal.style.display = 'flex';
}

// document.querySelector('.close-modal').addEventListener('click', function () {
//     document.getElementById('modal').style.display = 'none';
// });

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