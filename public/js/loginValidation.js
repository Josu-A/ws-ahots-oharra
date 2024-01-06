const loginForm = document.getElementById('login-form');
const username = document.getElementById('username');
const password = document.getElementById('password');

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

username.addEventListener('input', () => isValidUsername());
password.addEventListener('input', () => isValidPassword());

loginForm.addEventListener('submit', event => {
    event.preventDefault();

    let isValidForm = isValidUsername() && isValidPassword();

    if (isValidForm) {
        fetch('/users/login', {
            "method" : "POST",
            "headers" : {
                "Content-Type" : "application/json"
            },
            "body" : JSON.stringify({ 
                "username" : username.value,
                "password" : password.value
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