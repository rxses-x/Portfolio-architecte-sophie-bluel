import { fetchData } from "./tools.js"

// function updateModal(data) {
//     const modal = document.createElement('aside');
//     modal.id = 'modal';
//     modal.className = 'modal';
//     modal.style.display = 'flex';

//     modal.addEventListener('click', () => {
//         modal.style.display = 'none';
//     });

//     const modalContainer = document.createElement('div')
//     modalContainer.className = "modal-container"

//     const closeModal = document.createElement('span');
//     closeModal.className = 'close-modal';
//     closeModal.innerHTML = '<i class="fa-solid fa-xmark"></i>';
//     closeModal.addEventListener('click', () => {
//         modal.style.display = 'none';
//     });

//     // Create title
//     const modalTitle = document.createElement('span');
//     modalTitle.className = 'modal-title';
//     modalTitle.textContent = 'Galerie photo';


//     data.forEach(image => {

//         const deleteButton = document.createElement('button');
//         deleteButton.className = 'delete-button';
//         deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

//         const imageGrid = document.createElement("div");
//         imageGrid.className = "modal-image-grid"
//         imageGrid.id = "modal-image-grid"
//         imageGrid.innerHTML = ''; // Clear existing content

//         const imageContainer = document.createElement('div');
//         imageContainer.className = 'image-container';

//         const img = document.createElement('img');
//         img.src = image.imageUrl;
//         img.alt = image.title;

//         imageContainer.appendChild(img);

//         imageContainer.appendChild(deleteButton);

//         console.log("imageGrid", imageGrid.appendChild(img))
//     })

// //     

// //     data.forEach(image => {
// //         const imageContainer = document.createElement('div');
// //         imageContainer.className = 'image-container';

// //         const img = document.createElement('img');
// //         img.src = image.imageUrl;
// //         img.alt = image.title;

// //         const deleteButton = document.createElement('button');
// //         deleteButton.className = 'delete-button';
// //         deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

// //         // Append all elements to modal container
//         modalContainer.appendChild(closeModal);
//         modalContainer.appendChild(modalTitle);
// //         modalContainer.appendChild(uploadArea);
// //         modalContainer.appendChild(inputGroupTitle);
// //         modalContainer.appendChild(inputGroupCategory);
// //         modalContainer.appendChild(separatorLine);
// //         modalContainer.appendChild(submitButton);
    
// //         // Append modal container to modal
//         modal.appendChild(modalContainer);

// //         imageContainer.appendChild(img);
// //         imageContainer.appendChild(deleteButton);
// //     });

//     // Create separator line
//     const separatorLine = document.createElement('hr');
//     separatorLine.className = 'separator-line';

//     modalContainer.appendChild(separatorLine);
// //     // Append modal to body
//     document.body.appendChild(modal);
// //     modal.style.display = 'flex';
// }

async function updateModal(data, token) {
    // Create the <aside> element for the modal
    const modal = document.createElement('aside');
    modal.id = 'modal';
    modal.className = 'modal';
    modal.style.display = 'flex'; // To make the modal visible

    // Create the container for modal content
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';

    // Create the close button
    const closeModal = document.createElement('span');
    closeModal.className = 'close-modal';
    closeModal.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeModal.addEventListener('click', (event) => {
        modal.style.display = 'none';
    });

    // Create the title of the modal
    const modalTitle = document.createElement('span');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = 'Galerie photo';

    // Create the image grid container
    const imageGrid = document.createElement('div');
    imageGrid.className = 'modal-image-grid';
    imageGrid.id = 'modal-image-grid';

    const imageData = await data.json()

    // Loop through the data to add images to the modal
    imageData.forEach(image => {
        console.log("img id: ", image.id)
        // Create the image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';

        // Create the img element
        const img = document.createElement('img');
        img.src = image.imageUrl; // Set the image source
        img.alt = image.title; // Set the image alt text

        // Create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.type = "button"
        deleteButton.setAttribute("img-id", image.id)
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

        // Add click event for delete button
        deleteButton.addEventListener('click', async (event) => {
            event.preventDefault(); // Prevent the default form submission
            const imgId = event.currentTarget.getAttribute('img-id');
            try {
                const response = await fetchData(`works/${imgId}`, {
                    method: 'DELETE',
                    headers: {
                        'accept': '*/*',
                        'Authorization': `Bearer ${token}`
                    }
                })
                const responseState = response.ok
                console.log(`Image with ID ${imgId} was deleted.`);
                if (responseState) {
                    console.log(`Image with ID ${imgId} was deleted.`);
                    // Remove the image element from the DOM
                    imageContainer.remove();
                    event.currentTarget.parentElement.remove();
                } else {
                    console.error('Failed to delete the image.');
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }

            return false; // Prevent any further action (like form submission)
        });

        // Append the img and delete button to the image container
        imageContainer.appendChild(img);
        imageContainer.appendChild(deleteButton);

        // Append the image container to the image grid
        imageGrid.appendChild(imageContainer);
    });

    // Create the separator line
    const separatorLine = document.createElement('hr');
    separatorLine.className = 'separator-line';

    // Create the add photo button
    const addPhotoButton = document.createElement('button');
    addPhotoButton.className = 'add-photo-button';
    addPhotoButton.textContent = 'Ajouter une photo';
    addPhotoButton.addEventListener('click', () => {
        initializeModal(true)
        modal.style.display = 'none';
        // Logic for adding a photo goes here
    });

    // Append all elements to the modal container
    modalContainer.appendChild(closeModal);
    modalContainer.appendChild(modalTitle);
    modalContainer.appendChild(imageGrid);
    modalContainer.appendChild(separatorLine);
    modalContainer.appendChild(addPhotoButton);

    // Append the modal container to the modal
    modal.appendChild(modalContainer);

    // Append the modal to the body
    document.body.appendChild(modal);

    // Show the modal
    modal.style.display = 'flex';
}

async function createAddModal(data, token) {
    // Create the <aside> element for the modal
    // const modal = document.createElement('aside');
    // modal.id = 'modal-gallery';
    // modal.className = 'modal';
    // modal.style.display = 'flex'; // To make the modal visible

    // // Create the container for modal content
    // const modalContainer = document.createElement('div');
    // modalContainer.className = 'modal-container';

    // // Create the title of the modal
    // const modalTitle = document.createElement('span');
    // modalTitle.className = 'modal-title';
    // modalTitle.textContent = 'Ajout photo';

    //  // Create the separator line
    // const separatorLine = document.createElement('hr');
    // separatorLine.className = 'separator-line';

    // const validateButton = document.createElement('button');
    // validateButton.className = 'add-photo-button';
    // validateButton.textContent = 'Valider';

    // // Append all elements to the modal container
    // modalContainer.appendChild(modalTitle);
    // modalContainer.appendChild(separatorLine);
    // modalContainer.appendChild(validateButton);

    // // Append the modal container to the modal
    // modal.appendChild(modalContainer);

    // // Append the modal to the body
    // document.body.appendChild(modal);

    // // Show the modal
    // modal.style.display = 'flex';

    /* const addPhotoModal = document.createElement('aside');
    addPhotoModal.id = 'modal-gallery';
    addPhotoModal.className = 'modal';
    addPhotoModal.style.display = 'flex'; // Make the modal visible

    const addPhotoModalContainer = document.createElement('div');
    addPhotoModalContainer.className = 'modal-container';

    // Create the close button for the new modal
    const closeAddPhotoModal = document.createElement('span');
    closeAddPhotoModal.className = 'close-modal';
    closeAddPhotoModal.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeAddPhotoModal.addEventListener('click', (event) => {
        addPhotoModal.style.display = 'none';
    });

    // Create the title for the modal
    const modalTitle = document.createElement('span');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = 'Ajout photo';

    // Create the image placeholder (similar to the screenshot)
    const uploadArea = document.createElement('div');
    uploadArea.className = 'upload-area';
    uploadArea.style.backgroundColor = '#EAF1F6'; // Example background color
    uploadArea.style.padding = '20px';
    uploadArea.style.borderRadius = '10px';
    uploadArea.style.textAlign = 'center';
    
    // // Image icon placeholder
    // const imgPlaceholder = document.createElement('div');
    // imgPlaceholder.innerHTML = '<img src="path-to-image-icon.png" alt="Image icon" style="width: 50px; height: 50px;" />'; // Use a placeholder image path or icon
    // uploadArea.appendChild(imgPlaceholder);

    // Create upload button (inside the upload area)
    const uploadButton = document.createElement('button');
    uploadButton.className = 'add-photo-button';
    uploadButton.textContent = '+ Ajouter photo';
    uploadButton.style.margin = '10px';
    
    // File input for the photo
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg, image/png';
    fileInput.style.display = 'none'; // Hidden input field
    uploadButton.addEventListener('click', () => {
        fileInput.click(); // Trigger file input when button is clicked
    });

    // Handle file selection
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Selected file:', file.name);
            // Handle file upload logic here (e.g., preview image, upload to server, etc.)
        }
    });

    // Add file input to the DOM (hidden)
    uploadArea.appendChild(uploadButton);
    uploadArea.appendChild(fileInput);

    // Create instructions text (jpg, png: 4mo max)
    const instructions = document.createElement('p');
    instructions.textContent = 'jpg, png : 4mo max';
    instructions.style.color = '#666'; // Example text color
    uploadArea.appendChild(instructions);

    // Create the 'Titre' field
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Titre';
    titleLabel.style.marginTop = '20px';
    titleLabel.style.display = 'block';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Entrez un titre';
    titleInput.style.width = '100%';
    titleInput.style.marginTop = '5px';
    titleInput.style.padding = '10px';
    titleInput.style.borderRadius = '5px';
    titleInput.style.border = '1px solid #ccc';

    // Create the 'Catégorie' field
    const categoryLabel = document.createElement('label');
    categoryLabel.textContent = 'Catégorie';
    categoryLabel.style.marginTop = '20px';
    categoryLabel.style.display = 'block';

    const categorySelect = document.createElement('select');
    categorySelect.style.width = '100%';
    categorySelect.style.marginTop = '5px';
    categorySelect.style.padding = '10px';
    categorySelect.style.borderRadius = '5px';
    categorySelect.style.border = '1px solid #ccc';

    // Add categories as options

    data.forEach(categories => {
        const category = document.createElement('option');
        category.value = `${categories.id}`;
        category.text = categories.name;
        
        categorySelect.appendChild(category)
        console.log(category)
    })

    // Create the separator line
    const separatorLine = document.createElement('hr');
    separatorLine.className = 'separator-line';

    // Create the 'Valider' button
    const submitButton = document.createElement('button');
    submitButton.className = 'add-photo-button';
    submitButton.textContent = 'Valider';
    submitButton.style.backgroundColor = '#ccc';

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
    addPhotoModal.style.display = 'flex'; */

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

    // Create the image placeholder (similar to the screenshot)
    const uploadArea = document.createElement('div');
    uploadArea.className = 'upload-area';

    // Image icon placeholder
    const imgPlaceholder = document.createElement('div');
    imgPlaceholder.className = 'img-placeholder';
    
    // Default placeholder image
    const imgElement = document.createElement('span');
    imgElement.innerHTML = '<i class="fa-regular fa-image"></i>'
    imgElement.src = 'path-to-placeholder-image.png'; // Use your actual placeholder image path
    imgElement.className = 'image-preview';
    imgElement.alt = 'Image Preview';
    imgElement.style.maxWidth = '100%';
    imgPlaceholder.appendChild(imgElement);

    uploadArea.appendChild(imgPlaceholder);

    // Create upload button (inside the upload area)
    const uploadButton = document.createElement('button');
    uploadButton.className = 'add-photo-button';
    uploadButton.textContent = '+ Ajouter photo';

    // File input for the photo
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg, image/png';
    fileInput.style.display = 'none'; // Hidden input field

    // Limit file size to 4MB (4mo)
    const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes

    uploadButton.addEventListener('click', () => {
        fileInput.click(); // Trigger file input when button is clicked
    });

    // Add file input to the DOM (hidden)
    uploadArea.appendChild(uploadButton);
    uploadArea.appendChild(fileInput);

    // Create instructions text (jpg, png: 4mo max)
    const instructions = document.createElement('p');
    instructions.textContent = 'jpg, png : 4mo max';
    instructions.className = 'upload-instructions';
    uploadArea.appendChild(instructions);

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

    // Handle file selection and image preview
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file) {
        // Check if the file size exceeds 4MB
            if (file.size > MAX_FILE_SIZE) {
                alert('The selected file exceeds the 4MB limit. Please choose a smaller file.');
                fileInput.value = ''; // Clear the file input
            } else {
                // Proceed with the file (file is under 4MB)
                console.log('File selected:', file.name, 'Size:', file.size);

                // Prepare the form data to be sent via POST
                const formData = new FormData();
                console.log("File: ", file)
                console.log("titleLabel: ", titleInput.value)
                console.log("categoryLabel: ", categorySelect.value)
                // formData.append('image', file);
                // formData.append('title', titleLabel.value);
                // formData.append('category', categoryLabel.value);

                // Send the form data via POST request
                /* fetchData(`${api}works`, {
                    method: 'POST',
                    headers: {
                        'accept: application/json'
                        'Authorization': `Bearer ${token}`,
                        'Content-Type: multipart/form-data'
                    },
                    body: formData
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                response.json()
                })
                .then(data => {
                    console.log('Success:', data);
                    alert("Image uploaded successfully!");
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert(`Failed to upload the image. Please try again. Error: ${error.message}`);
                });*/
                    // Add any further logic here (e.g., displaying the image or uploading it)
                }
        }
    });

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
    submitButton.className = 'add-new-photo-button';
    submitButton.textContent = 'Valider';
    submitButton.disabled = true

    submitButton.addEventListener('click', () => {
        // After submission logic (e.g., API call), clear the form fields
        titleInput.value = '';         // Clear title input
        categoryInput.value = '';      // Clear category input
        fileInput.value = '';          // Clear file input (it clears by setting value to empty string)

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

// // Function to create the modal structure
// // function createModal() {
// //     // Create modal container
// //     const modal = document.createElement('aside');
// //     modal.id = 'modal';
// //     modal.className = 'modal';
// //     modal.style.display = 'none'; // Initially hide the modal
  
// //     const modalContainer = document.createElement('div');
// //     modalContainer.className = 'modal-container';
  
// //     // Create close button
// //     const closeModal = document.createElement('span');
// //     closeModal.className = 'close-modal';
// //     closeModal.innerHTML = '<i class="fa-solid fa-xmark"></i>';
// //     closeModal.addEventListener('click', () => {
// //       modal.style.display = 'none';
// //     });
  
// //     // Create title
// //     const modalTitle = document.createElement('span');
// //     modalTitle.className = 'modal-title';
// //     modalTitle.textContent = 'Ajout photo';
  
// //     // Create upload area
// //     const uploadArea = document.createElement('div');
// //     uploadArea.className = 'upload-area';
  
// //     const uploadPlaceholder = document.createElement('div');
// //     uploadPlaceholder.className = 'upload-placeholder';
  
// //     const uploadIcon = document.createElement('i');
// //     uploadIcon.className = 'fa-solid fa-image';
  
// //     const uploadText = document.createElement('span');
// //     uploadText.className = 'upload-text';
// //     uploadText.textContent = '+ Ajouter photo';
  
// //     const uploadSubtext = document.createElement('span');
// //     uploadSubtext.className = 'upload-subtext';
// //     uploadSubtext.textContent = 'jpg, png : 4mo max';
  
// //     // Append upload area elements
// //     uploadPlaceholder.appendChild(uploadIcon);
// //     uploadPlaceholder.appendChild(uploadText);
// //     uploadPlaceholder.appendChild(uploadSubtext);
// //     uploadArea.appendChild(uploadPlaceholder);
  
// //     // Create input fields
// //     const inputGroupTitle = document.createElement('div');
// //     inputGroupTitle.className = 'input-group';
  
// //     const titleLabel = document.createElement('label');
// //     titleLabel.setAttribute('for', 'title');
// //     titleLabel.textContent = 'Titre';
  
// //     const titleInput = document.createElement('input');
// //     titleInput.type = 'text';
// //     titleInput.id = 'title';
// //     titleInput.className = 'input-field';
// //     titleInput.placeholder = 'Titre';
  
// //     inputGroupTitle.appendChild(titleLabel);
// //     inputGroupTitle.appendChild(titleInput);
  
// //     const inputGroupCategory = document.createElement('div');
// //     inputGroupCategory.className = 'input-group';
  
// //     const categoryLabel = document.createElement('label');
// //     categoryLabel.setAttribute('for', 'category');
// //     categoryLabel.textContent = 'Catégorie';
  
// //     const categorySelect = document.createElement('select');
// //     categorySelect.id = 'category';
// //     categorySelect.className = 'input-field';
  
// //     const defaultOption = document.createElement('option');
// //     defaultOption.value = '';
// //     defaultOption.disabled = true;
// //     defaultOption.selected = true;
// //     defaultOption.textContent = 'Catégorie';
  
// //     categorySelect.appendChild(defaultOption);
// //     // Add more options here if needed
// //     inputGroupCategory.appendChild(categoryLabel);
// //     inputGroupCategory.appendChild(categorySelect);
  
// //     // Create separator line
// //     const separatorLine = document.createElement('hr');
// //     separatorLine.className = 'separator-line';
  
// //     // Create submit button
// //     const submitButton = document.createElement('button');
// //     submitButton.className = 'submit-button';
// //     submitButton.textContent = 'Valider';
  
// //     // Append all elements to modal container
// //     modalContainer.appendChild(closeModal);
// //     modalContainer.appendChild(modalTitle);
// //     modalContainer.appendChild(uploadArea);
// //     modalContainer.appendChild(inputGroupTitle);
// //     modalContainer.appendChild(inputGroupCategory);
// //     modalContainer.appendChild(separatorLine);
// //     modalContainer.appendChild(submitButton);
  
// //     // Append modal container to modal
// //     modal.appendChild(modalContainer);
  
// //     // Append modal to body
// //     document.body.appendChild(modal);
// //   }
  
// //   // Call the function to create the modal
// // createModal();
  
//   // Event listener to open the modal when the button is clicked
// //   document.querySelector('.add-photo-button').addEventListener('click', function() {
// //     document.getElementById('modal-gallery').style.display = 'flex';
// //   });

/* const test = {
    addPhotoButton.addEventListener('click', () => {
        // Create a new modal for adding a photo
        const addPhotoModal = document.createElement('aside');
        addPhotoModal.className = 'modal';
        addPhotoModal.style.display = 'flex'; // Make the modal visible
    
        // Close the new modal on background click
        addPhotoModal.addEventListener('click', () => {
            addPhotoModal.style.display = 'none';
        });
    
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
        const modalTitle = document.createElement('h2');
        modalTitle.textContent = 'Ajout photo';
        modalTitle.className = 'modal-title';
    
        // Create the image placeholder (similar to the screenshot)
        const uploadArea = document.createElement('div');
        uploadArea.className = 'upload-area';
    
        // Image icon placeholder
        const imgPlaceholder = document.createElement('div');
        imgPlaceholder.className = 'img-placeholder';
        
        // Default placeholder image
        const imgElement = document.createElement('img');
        imgElement.src = 'path-to-placeholder-image.png'; // Use your actual placeholder image path
        imgElement.className = 'image-preview';
        imgElement.alt = 'Image Preview';
        imgElement.style.maxWidth = '100%';
        imgPlaceholder.appendChild(imgElement);
    
        uploadArea.appendChild(imgPlaceholder);
    
        // Create upload button (inside the upload area)
        const uploadButton = document.createElement('button');
        uploadButton.className = 'add-photo-button';
        uploadButton.textContent = '+ Ajouter photo';
    
        // File input for the photo
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/jpeg, image/png';
        fileInput.style.display = 'none'; // Hidden input field
        uploadButton.addEventListener('click', () => {
            fileInput.click(); // Trigger file input when button is clicked
        });
    
        // Handle file selection and image preview
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imgElement.src = e.target.result; // Set the image preview to the selected image
                };
                reader.readAsDataURL(file); // Convert the file into a data URL
            }
        });
    
        // Add file input to the DOM (hidden)
        uploadArea.appendChild(uploadButton);
        uploadArea.appendChild(fileInput);
    
        // Create instructions text (jpg, png: 4mo max)
        const instructions = document.createElement('p');
        instructions.textContent = 'jpg, png : 4mo max';
        instructions.className = 'upload-instructions';
        uploadArea.appendChild(instructions);
    
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
        const option1 = document.createElement('option');
        option1.value = 'cat1';
        option1.text = 'Hotels & restaurants';
        const option2 = document.createElement('option');
        option2.value = 'cat2';
        option2.text = 'Autres';
        categorySelect.appendChild(option1);
        categorySelect.appendChild(option2);
    
        // Create the 'Valider' button
        const submitButton = document.createElement('button');
        submitButton.className = 'submit-button';
        submitButton.textContent = 'Valider';
    
        // Append the upload area, title input, category input, and submit button to the modal container
        addPhotoModalContainer.appendChild(closeAddPhotoModal);
        addPhotoModalContainer.appendChild(modalTitle);
        addPhotoModalContainer.appendChild(uploadArea);
        addPhotoModalContainer.appendChild(titleLabel);
        addPhotoModalContainer.appendChild(titleInput);
        addPhotoModalContainer.appendChild(categoryLabel);
        addPhotoModalContainer.appendChild(categorySelect);
        addPhotoModalContainer.appendChild(submitButton);
    
        // Append the new modal container to the new modal
        addPhotoModal.appendChild(addPhotoModalContainer);
    
        // Append the new modal to the body
        document.body.appendChild(addPhotoModal);
    
        // Show the new modal
        addPhotoModal.style.display = 'flex';
    });
    
} */