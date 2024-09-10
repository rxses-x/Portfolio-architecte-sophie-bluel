const api = "http://localhost:5678/api/"

async function fetchData(url) {
    try {
        const response = await fetch(url);
        return response.json();
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

function updateModal(data) {
    const modal = document.createElement('aside');
    modal.id = 'modal';
    modal.className = 'modal';
    modal.style.display = 'flex';

    const modalContainer = document.createElement('div')
    modalContainer.className = "modal-container"

    const closeModal = document.createElement('span');
    closeModal.className = 'close-modal';
    closeModal.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Create title
    const modalTitle = document.createElement('span');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = 'Galerie photo';


    data.forEach(image => {
        const imageGrid = document.createElement("div");
        imageGrid.className = "modal-image-grid"
        imageGrid.id = "modal-image-grid"
        imageGrid.innerHTML = ''; // Clear existing content

        const img = document.createElement('img');
        img.src = image.imageUrl;
        img.alt = image.title;

        imageGrid.appendChild(modalContainer);
    })

//     

//     data.forEach(image => {
//         const imageContainer = document.createElement('div');
//         imageContainer.className = 'image-container';

//         const img = document.createElement('img');
//         img.src = image.imageUrl;
//         img.alt = image.title;

//         const deleteButton = document.createElement('button');
//         deleteButton.className = 'delete-button';
//         deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

//         // Append all elements to modal container
        modalContainer.appendChild(closeModal);
        modalContainer.appendChild(modalTitle);
//         modalContainer.appendChild(uploadArea);
//         modalContainer.appendChild(inputGroupTitle);
//         modalContainer.appendChild(inputGroupCategory);
//         modalContainer.appendChild(separatorLine);
//         modalContainer.appendChild(submitButton);
    
//         // Append modal container to modal
        modal.appendChild(modalContainer);

//         imageContainer.appendChild(img);
//         imageContainer.appendChild(deleteButton);
//     });

    // Create separator line
    const separatorLine = document.createElement('hr');
    separatorLine.className = 'separator-line';

    modalContainer.appendChild(separatorLine);
//     // Append modal to body
    document.body.appendChild(modal);
//     modal.style.display = 'flex';
}

// document.querySelector('.close-modal').addEventListener('click', function () {
//     document.getElementById('modal').style.display = 'none';
// });

async function initializeModal() {
    const galleryData = await fetchData(`${api}works`);
    updateModal(galleryData);
}

export {initializeModal}

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