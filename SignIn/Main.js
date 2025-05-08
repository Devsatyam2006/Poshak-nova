// DOM Elements
const loginForm = document.getElementById('login-form-element');
const registerForm = document.getElementById('register-form-element');
const forgotForm = document.getElementById('forgot-form-element');
const resetForm = document.getElementById('reset-form-element');
const verificationForm = document.getElementById('verification-form-element');

// Form containers
const loginContainer = document.getElementById('login-form');
const registerContainer = document.getElementById('register-form');
const forgotContainer = document.getElementById('forgot-password-form');
const resetContainer = document.getElementById('reset-password-form');
const verificationContainer = document.getElementById('verification-form');

// Toggle links
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const backToLoginFromForgot = document.getElementById('back-to-login-from-forgot');
const backToLoginFromReset = document.getElementById('back-to-login-from-reset');
const switchToRegister = document.getElementById('switch-to-register');

// Left side elements
const leftTitle = document.getElementById('left-title');
const leftDescription = document.getElementById('left-description');
const leftLink = document.getElementById('left-link');

// Message elements
const loginMessage = document.getElementById('login-message');
const registerMessage = document.getElementById('register-message');
const forgotMessage = document.getElementById('forgot-message');
const resetMessage = document.getElementById('reset-message');
const verificationMessage = document.getElementById('verification-message');

// Verification elements
const verificationEmailDisplay = document.getElementById('verification-email-display');
const resendCodeLink = document.getElementById('resend-code');
const verificationInputs = document.querySelectorAll('.verification-input');

// Password toggle functionality
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});

// Password strength indicator
const registerPassword = document.getElementById('register-password');
const resetPassword = document.getElementById('reset-password');
const passwordStrengthMeter = document.getElementById('password-strength-meter');
const resetStrengthMeter = document.getElementById('reset-strength-meter');

registerPassword.addEventListener('input', updatePasswordStrength);
resetPassword.addEventListener('input', updateResetPasswordStrength);

function updatePasswordStrength() {
    const strength = calculatePasswordStrength(registerPassword.value);
    passwordStrengthMeter.className = 'strength-meter ' + strength;
}

function updateResetPasswordStrength() {
    const strength = calculatePasswordStrength(resetPassword.value);
    resetStrengthMeter.className = 'strength-meter ' + strength;
}

function calculatePasswordStrength(password) {
    if (password.length === 0) return '';
    let strength = 0;
    if (password.length > 7) strength++;
    if (password.length > 11) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
}

// Helper function to show message
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = type === 'success' ? 'message success' : 'message error';
}

// Form switching
showRegisterLink.addEventListener('click', switchToRegisterView);
switchToRegister.addEventListener('click', switchToRegisterView);

function switchToRegisterView(e) {
    e.preventDefault();
    loginContainer.classList.add('hidden');
    registerContainer.classList.remove('hidden');
    leftTitle.textContent = 'Join Our Community';
    leftDescription.textContent = 'Create an account to unlock exclusive benefits, save your wishlist, and track your orders with ease.';
    leftLink.innerHTML = 'Already have an account? <a href="#" id="switch-to-login">Sign in</a>';

    document.getElementById('switch-to-login').addEventListener('click', switchToLoginView);
}

showLoginLink.addEventListener('click', switchToLoginView);

function switchToLoginView(e) {
    e.preventDefault();
    registerContainer.classList.add('hidden');
    forgotContainer.classList.add('hidden');
    resetContainer.classList.add('hidden');
    verificationContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
    leftTitle.textContent = 'Welcome Back';
    leftDescription.textContent = 'Continue your celestial fashion journey with Astral Threads. Access your wishlist, track orders, and discover personalized recommendations.';
    leftLink.innerHTML = 'New to Astral Threads? <a href="#" id="switch-to-register">Create an account</a>';

    document.getElementById('switch-to-register').addEventListener('click', switchToRegisterView);
}

forgotPasswordLink.addEventListener('click', function(e) {
    e.preventDefault();
    loginContainer.classList.add('hidden');
    forgotContainer.classList.remove('hidden');
    leftTitle.textContent = 'Reset Your Password';
    leftDescription.textContent = 'Enter your email address and we\'ll send you a link to reset your password.';
    leftLink.innerHTML = 'Remember your password? <a href="#" id="switch-to-login-from-forgot">Sign in</a>';

    document.getElementById('switch-to-login-from-forgot').addEventListener('click', switchToLoginView);
});

backToLoginFromForgot.addEventListener('click', switchToLoginView);
backToLoginFromReset.addEventListener('click', switchToLoginView);

// Verification code input auto-focus
verificationInputs.forEach((input, index) => {
    input.addEventListener('input', function() {
        if (this.value.length === 1 && index < verificationInputs.length - 1) {
            verificationInputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
            verificationInputs[index - 1].focus();
        }
    });
});

// Form submissions
verificationForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = verificationEmailDisplay.textContent;
    let code = '';
    verificationInputs.forEach(input => code += input.value);
  
    try {
      const response = await fetch("http://localhost:3000/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
  
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || "Verification failed");
      
      showMessage(verificationMessage, 'Verification successful! Redirecting...', 'success');
      setTimeout(() => {
        verificationContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
      }, 1500);
    } catch (err) {
      showMessage(verificationMessage, err.message, 'error');
    }
  });
  

registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (!name || !email || !password || !confirmPassword) {
        showMessage(registerMessage, 'Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage(registerMessage, 'Passwords do not match', 'error');
        return;
    }

    if (password.length < 8) {
        showMessage(registerMessage, 'Password must be at least 8 characters', 'error');
        return;
    }

    const formData = { name, email, password };

        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
    
        const data = await response.json();
    
        if (response.ok) {
            showMessage(registerMessage, 'Account created! Sending verification code...', 'success');
            
            // Send verification code
            try {
              const codeResponse = await fetch("http://localhost:3000/send-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
              });
              
              const codeData = await codeResponse.json();
              if (!codeResponse.ok) throw new Error(codeData.message || "Failed to send code");
              
              // Show verification form
              registerContainer.classList.add('hidden');
              verificationContainer.classList.remove('hidden');
              verificationEmailDisplay.textContent = formData.email;
            } catch (err) {
              showMessage(registerMessage, err.message, 'error');
            }
          }
        });

resendCodeLink.addEventListener('click', async function(e) {
            e.preventDefault();
            const email = verificationEmailDisplay.textContent;
            
            try {
              const response = await fetch("http://localhost:3000/send-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
              });
              
              const data = await response.json();
              if (!response.ok) throw new Error(data.message || "Failed to resend code");
              
              showMessage(verificationMessage, 'New verification code sent!', 'success');
            } catch (err) {
              showMessage(verificationMessage, err.message, 'error');
            }
          });

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showMessage(loginMessage, 'Please fill in all fields', 'error');
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.isVerified === false) {
                loginContainer.classList.add('hidden');
                verificationContainer.classList.remove('hidden');
                verificationEmailDisplay.textContent = email;
                showMessage(verificationMessage, data.message, 'error');
                return;
            }
            throw new Error(data.message || "Login failed");
        }

        showMessage(loginMessage, 'Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = "../Test.html";
        }, 1500);

    } catch (error) {
        alert("Network error. Please try again.");
        console.error("Error:", error);
    }
});
