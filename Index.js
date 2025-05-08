
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Cart functionality
    const cartIcon = document.getElementById('cart-icon');
    const cartDrawer = document.querySelector('.cart-drawer');
    const closeCart = document.querySelector('.close-cart');
    const overlay = document.querySelector('.overlay');
    
    cartIcon.addEventListener('click', function() {
        cartDrawer.classList.add('open');
        overlay.classList.add('active');
    });
    
    closeCart.addEventListener('click', function() {
        cartDrawer.classList.remove('open');
        overlay.classList.remove('active');
    });
    
    overlay.addEventListener('click', function() {
        cartDrawer.classList.remove('open');
        overlay.classList.remove('active');
    });
    
    // Product gallery thumbnail click
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            // Add active class to clicked thumbnail
            this.classList.add('active');
            // Change main image (in a real site, you'd use different images)
            mainImage.src = this.src;
        });
    });
    
    // Size selector
    const sizeOptions = document.querySelectorAll('.size-option');
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Color selector
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Quantity selector
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (this.textContent === '+' && value < 10) {
                input.value = value + 1;
            } else if (this.textContent === '-' && value > 1) {
                input.value = value - 1;
            }
        });
    });
