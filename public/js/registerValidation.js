const registerForm = document.getElementById('register-form');
const username = document.getElementById('username');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const email = document.getElementById('email');

const isValidUsername = () => {
    let isUsernameValid = true;
    const usernameRegEx = /^[a-zA-Z][a-zA-Z0-9-_]{2,}$/;
    username.setCustomValidity('');
    if (username.value.length < 3) {
        username.setCustomValidity('Username is too short (must be at least 3 characters).');
        isUsernameValid = false;
    }
    else if (!usernameRegEx.test(username.value)) {
        username.setCustomValidity('Username must start with a letter and only contain letters, numbers, hyphens, and underscores.');
        isUsernameValid = false;
    }
    else {
        username.setCustomValidity('');
    }
    return isUsernameValid;
}

const isValidPassword = () => {
    let isPasswordValid = true;
    password.setCustomValidity('');
    if (password.value.length < 6) {
        password.setCustomValidity('Password is too short (must be at least 6 characters).');
        isPasswordValid = false;
    }
    else {
        password.setCustomValidity('');
    }
    return isPasswordValid;
}

const passwordsMatch = () => {
    let doPasswordsMatch = true;
    confirmPassword.setCustomValidity('');
    if (password.value != confirmPassword.value) {
        confirmPassword.setCustomValidity('Passwords do not match.');
        doPasswordsMatch = false;
    }
    else {
        confirmPassword.setCustomValidity('');
    }
    return doPasswordsMatch;
}

username.addEventListener('input', () => isValidUsername());
password.addEventListener('input', () => isValidPassword());
confirmPassword.addEventListener('input', () => passwordsMatch());

registerForm.addEventListener('submit', event => {
    event.preventDefault();

    let isValidForm = isValidUsername() && isValidPassword() && passwordsMatch();

    if (isValidForm) {
        fetch('/users/register', {
            "method" : "POST",
            "headers" : {
                "Content-Type" : "application/json"
            },
            "body" : JSON.stringify({ 
                "username" : username.value,
                "password" : password.value,
                "confirmPassword" : confirmPassword.value,
                "email" : email.value
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.status == 'error') {
                Snackbar.show({
                    "text" : data.message,
                    "pos" : "top-center",
                    "showAction" : false,
                    "customClass" : "my-snackbar"
                });
            }
            else {
                window.location.href = '/';
            }
        })
        .catch(error => console.error('Error:', error));
    }
});