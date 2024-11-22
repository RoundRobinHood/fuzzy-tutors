// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get references to the forms and toggle elements
    const loginForm = document.querySelector('.container > form:nth-of-type(1)');
    const registrationForm = document.querySelector('.container > form:nth-of-type(2)');
    const toggleElements = document.querySelectorAll('#registerLoginToggle');

    // References to form elements
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    const loginUsernameTxt = document.getElementById('loginUsernameTxt');
    const loginPasswordTxt = document.getElementById('loginPasswordTxt');
    const usernameTxt = document.getElementById('usernameTxt');
    const userTypeSlt = document.getElementById('userTypeSlt');
    const emailTxt = document.getElementById("emailTxt");

    // Initially hide the registration form
    if (registrationForm) {
        registrationForm.style.display = 'none';
    }

    // Add click event listeners to all toggle elements
    toggleElements.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            
            // Toggle visibility of forms
            if (loginForm && registrationForm) {
                if (loginForm.style.display === 'none') {
                    // Show login form, hide registration form
                    loginForm.style.display = 'block';
                    registrationForm.style.display = 'none';
                    
                    loginForm.style.opacity = '0';
                    setTimeout(() => {
                        loginForm.style.opacity = '1';
                    }, 10);
                } else {
                    // Show registration form, hide login form
                    loginForm.style.display = 'none';
                    registrationForm.style.display = 'block';
                    
                    registrationForm.style.opacity = '0';
                    setTimeout(() => {
                        registrationForm.style.opacity = '1';
                    }, 10);
                }
            }
        });
});



loginBtn.addEventListener('click', async (e)=>{
    let formValidation = FormValidator.validateLoginCredentials(loginUsernameTxt.value, loginPasswordTxt.value);
    if (formValidation.isValid) {
        if (formValidation.isEmail) {
            alert("you have email")
        } else if (!formValidation.isEmail) {
            alert("you have username")
        }
        let loginResult = await loginUser(loginUsernameTxt.value, formValidation.isEmail, loginPasswordTxt.value);
        alert(loginResult.message);
    } else {
        alert(formValidation.message);
    }
});

registerBtn.addEventListener('click', async (e) => {
    let formValidation = FormValidator.validateRegistrationCredentials(usernameTxt.value, emailTxt.value, passwordTxt.value, passwordConfirmationTxt.value);
    if (formValidation.isValid) {
        let registrationResult = await registerUser(usernameTxt.value, userTypeSlt.value, emailTxt.value, passwordTxt.value);
        alert(registrationResult.message);
    } else {
        alert(formValidation.message);
    }
});


/* ================================== Input Validation ================================== */
usernameTxt.addEventListener('focusout', (e) => {
    displayValidationIndication(usernameTxt, FormValidator.validateUsername(usernameTxt.value));
});

userTypeSlt.addEventListener('focusout', (e) => {
    displayValidationIndication(userTypeSlt, FormValidator.validateUserType(userTypeSlt.value));
});

emailTxt.addEventListener('focusout', (e) => {
    displayValidationIndication(emailTxt, FormValidator.validateEmail(emailTxt.value));
});

passwordTxt.addEventListener('focusout', (e) => {
    displayValidationIndication(passwordTxt, FormValidator.validatePassword(passwordTxt.value));
});

passwordConfirmationTxt.addEventListener('focusout', (e) => {
    if(passwordConfirmationTxt.value != passwordTxt.value) {
        displayValidationIndication(passwordConfirmationTxt, new ValidationResult(false, "Passwords does not match"));
    }
});

/* =============================== Animations ==================================== */
// Add CSS for smooth transitions
const style = document.createElement('style');
style.textContent = `
    form {
        transition: opacity 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);
});