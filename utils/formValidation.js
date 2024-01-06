const validateUsername = username => {
    const usernameRegEx = /^[a-zA-Z][a-zA-Z0-9-_]{2,}$/;
    if (username.length < 3 || !usernameRegEx.test(username)) {
        return {
            "status" : "error",
            "message" : "Invalid username format."
        };
    }
    return null;
}

const validatePassword = password => {
    if (password.length < 6) {
        return {
            "status" : "error",
            "message" : "Password is too short (must be at least 6 characters)."
        };
    }
    return null;
}

const validateConfirmPassword = (password, confirmPassword) => {
    if (password != confirmPassword) {
        return {
            "status" : "error",
            "message" : "Passwords do not match."
        };
    }
    return null;
}

const validateEmail = email => {
    const emailRegEx = /^[^@]+@[^@]+$/;
    if (!emailRegEx.test(email)) {
        return {
            "status" : "error",
            "message" : "Invalid email format."
        };
    }
    return null;
}

const validateLoginFields = (requestBody) => {
    const username = requestBody.username;
    const password = requestBody.password;
    if (!username || !password) {
        return {
            "status" : "error",
            "message" : "Username and password are required."
        };
    }
    return validateUsername(username) || validatePassword(password) || { "status" : "success" };
}

const validateRegisterFields = (requestBody) => {
    const username = requestBody.username;
    const password = requestBody.password;
    const confirmPassword = requestBody.confirmPassword;
    const email = requestBody.email;
    if (!username || !password || !confirmPassword || !email) {
        return {
            "status" : "error",
            "message" : "Username, password, confirmPassword and email are required."
        }
    }
    return validateUsername(username) || validatePassword(password) || validateConfirmPassword(password, confirmPassword) || validateEmail(email) || { "status" : "success" };
}

module.exports = {
    validateUsername,
    validatePassword,
    validateConfirmPassword,
    validateEmail,
    validateLoginFields,
    validateRegisterFields
}