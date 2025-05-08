document.getElementById("save-product").addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission for demo purposes
    
    // Get form values
    const name = document.getElementById("product-name").value;
    const price = document.getElementById("product-price").value;
    const category = document.getElementById("product-category").value;
    const stock = document.getElementById("product-stock").value;
    const description = document.getElementById("product-description").value;
    const status = document.getElementById("product-status").value;
    
    // Get selected colors
    const colorCheckboxes = document.querySelectorAll('input[name="color"]:checked');
    const colors = Array.from(colorCheckboxes).map(cb => cb.value);
    
    // Get selected sizes
    const sizeCheckboxes = document.querySelectorAll('input[name="size"]:checked');
    const sizes = Array.from(sizeCheckboxes).map(cb => cb.value);
    
    // Handle image upload (simplified - in real app you'd need to upload to server)
    const imageInput = document.getElementById("product-images");
    let imageUrl = "";
    if (imageInput.files && imageInput.files[0]) {
        // For demo, we'll just show the filename
        imageUrl = URL.createObjectURL(imageInput.files[0]); 
        // In real app, you would upload the file to a server and get the URL
    }
    
    // Validate form (basic validation)
    if (!name || !price || !category || !stock) {
        alert("Please fill in all required fields");
        return;
    }
    
    // Update product count
    const totalProductElement = document.getElementById("total-product");
    let currentValue = parseInt(totalProductElement.textContent);
    totalProductElement.textContent = currentValue + 1;

    // Determine status
    const statusText = (parseInt(stock) > 0) ? 'Active' : 'Out of Stock';
    const statusClass = (parseInt(stock) > 0) ? 'active' : 'inactive';

    // Create new table row
    const tableBody = document.getElementById("product-table-body");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>
          <div class="product-cell">
            ${imageUrl ? `<img src="${imageUrl}" alt="${name}" class="product-img">` : ''}
            <span>${name}</span>
          </div>
        </td>
        <td>${category}</td>
        <td>$${parseFloat(price).toFixed(2)}</td>
        <td>${stock}</td>
        <td><span class="status ${statusClass}">${statusText}</span></td>
        <td>
          <button class="action-btn">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn">
            <i class="fas fa-trash"></i>
          </button>
        </td>
    `;

    tableBody.appendChild(newRow);

    // Reset form
    document.getElementById("product-form").reset();
    document.getElementById("image-preview").innerHTML = ""; // Clear image previews
});