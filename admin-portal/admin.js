// Product Modal Functionality
const addProductBtn = document.getElementById('add-product-btn');
const productModal = document.getElementById('product-modal');
const closeModalBtns = document.querySelectorAll('.close-modal, .close-modal-btn');
const saveProductBtn = document.getElementById('save-product');
const imageUpload = document.getElementById('image-upload');
const productImagesInput = document.getElementById('product-images');
const imagePreview = document.getElementById('image-preview');
const productForm = document.getElementById('product-form');

// Open modal
addProductBtn.addEventListener('click', () => {
    productModal.classList.add('active');
});

// Close modal
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        productModal.classList.remove('active');
    });
});

// Click anywhere outside modal to close
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.classList.remove('active');
    }
});

// Image upload preview
imageUpload.addEventListener('click', () => {
    productImagesInput.click();
});

productImagesInput.addEventListener('change', (e) => {
    handleImageSelection(e.target.files);
});

function handleImageSelection(files) {
    imagePreview.innerHTML = '';
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.match('image.*')) continue;
        
        const reader = new FileReader();
        
        reader.onload = (function(theFile) {
            return function(e) {
                const div = document.createElement('div');
                div.style.position = 'relative';
                div.style.display = 'inline-block';
                div.style.margin = '5px';
                
                const img = document.createElement('img');
                img.className = 'preview-img';
                img.src = e.target.result;
                img.title = theFile.name;
                img.style.width = '100px';
                img.style.height = '100px';
                img.style.objectFit = 'cover';
                
                const removeBtn = document.createElement('span');
                removeBtn.className = 'remove-img';
                removeBtn.innerHTML = '&times;';
                removeBtn.style.position = 'absolute';
                removeBtn.style.top = '0';
                removeBtn.style.right = '0';
                removeBtn.style.background = 'red';
                removeBtn.style.color = 'white';
                removeBtn.style.borderRadius = '50%';
                removeBtn.style.width = '20px';
                removeBtn.style.height = '20px';
                removeBtn.style.display = 'flex';
                removeBtn.style.justifyContent = 'center';
                removeBtn.style.alignItems = 'center';
                removeBtn.style.cursor = 'pointer';
                removeBtn.addEventListener('click', function() {
                    div.remove();
                });
                
                div.appendChild(img);
                div.appendChild(removeBtn);
                imagePreview.appendChild(div);
            };
        })(file);
        
        reader.readAsDataURL(file);
    }
}

// Drag and drop for images
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    imageUpload.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    imageUpload.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    imageUpload.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    imageUpload.style.borderColor = 'var(--primary)';
    imageUpload.style.backgroundColor = 'rgba(212, 184, 255, 0.1)';
}

function unhighlight() {
    imageUpload.style.borderColor = '#ddd';
    imageUpload.style.backgroundColor = 'transparent';
}

imageUpload.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    productImagesInput.files = files;
    handleImageSelection(files);
}

// Save product to database and upload images to Google Drive
saveProductBtn.addEventListener('click', async () => {
    const formData = new FormData(productForm);
    const productName = formData.get('product-name');
    const productPrice = formData.get('product-price');
    const productDescription = formData.get('product-description');
    const productCategory = formData.get('product-category');
    const images = productImagesInput.files;
    
    if (!productName || !productPrice || images.length === 0) {
        alert('Please fill in all required fields and upload at least one image');
        return;
    }
    
    try {
        // Show loading state
        saveProductBtn.disabled = true;
        saveProductBtn.textContent = 'Saving...';
        
        // 1. Upload images to Google Drive
        const imageUrls = await uploadImagesToGoogleDrive(images);
        
        // 2. Save product data to database with image URLs
        const productData = {
            name: productName,
            price: parseFloat(productPrice),
            description: productDescription,
            category: productCategory,
            images: imageUrls,
            createdAt: new Date().toISOString()
        };
        
        await saveProductToDatabase(productData);
        
        // 3. Reset form and show success
        alert('Product saved successfully!');
        productModal.classList.remove('active');
        productForm.reset();
        imagePreview.innerHTML = '';
        
        // 4. Refresh the products display
        await displayProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Error saving product. Please try again.');
    } finally {
        saveProductBtn.disabled = false;
        saveProductBtn.textContent = 'Save Product';
    }
});

// Function to upload images to Google Drive
async function uploadImagesToGoogleDrive(images) {
    // In a real implementation, you would:
    // 1. Authenticate with Google Drive API
    // 2. Upload each image file
    // 3. Get the shareable URLs
    
    // This is a mock implementation - replace with actual Google Drive API calls
    const uploadedUrls = [];
    
    for (let i = 0; i < images.length; i++) {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In a real app, this would be the URL from Google Drive
        const mockUrl = `https://drive.google.com/uc?id=mock-image-${Date.now()}-${i}`;
        uploadedUrls.push(mockUrl);
    }
    
    return uploadedUrls;
}

// Function to save product data to your database
async function saveProductToDatabase(productData) {
    // This would be replaced with your actual API call to your backend
    const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to save product to database');
    }
    
    return await response.json();
}

// Function to display products in the frontend
async function displayProducts() {
    // Fetch products from your database
    const response = await fetch('/api/products');
    const products = await response.json();
    
    const productsContainer = document.getElementById('products-container') || document.createElement('div');
    productsContainer.id = 'products-container';
    productsContainer.style.display = 'grid';
    productsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
    productsContainer.style.gap = '20px';
    productsContainer.style.padding = '20px';
    
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.style.border = '1px solid #ddd';
        productCard.style.borderRadius = '8px';
        productCard.style.overflow = 'hidden';
        productCard.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        
        // Product image (using first image)
        const img = document.createElement('img');
        img.src = product.images[0];
        img.style.width = '100%';
        img.style.height = '200px';
        img.style.objectFit = 'cover';
        
        // Product info
        const infoDiv = document.createElement('div');
        infoDiv.style.padding = '15px';
        
        const name = document.createElement('h3');
        name.textContent = product.name;
        name.style.margin = '0 0 10px 0';
        
        const price = document.createElement('p');
        price.textContent = `$${product.price.toFixed(2)}`;
        price.style.fontWeight = 'bold';
        price.style.margin = '0 0 10px 0';
        
        const description = document.createElement('p');
        description.textContent = product.description;
        description.style.color = '#666';
        description.style.margin = '0 0 10px 0';
        description.style.fontSize = '14px';
        
        infoDiv.appendChild(name);
        infoDiv.appendChild(price);
        infoDiv.appendChild(description);
        
        productCard.appendChild(img);
        productCard.appendChild(infoDiv);
        
        productsContainer.appendChild(productCard);
    });
    
    // Add to DOM if not already there
    if (!document.getElementById('products-container')) {
        document.body.appendChild(productsContainer);
    }
}

// Initialize the page by displaying products
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
});