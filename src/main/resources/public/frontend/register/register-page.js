/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
const usernameInput = document.getElementById("username-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const repeatPasswordInput = document.getElementById("repeat-password-input");
const registerButton = document.getElementById("register-button");


/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
registerButton.addEventListener("click", processRegistration);


/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration() {
    // Retrieving values from input fields
    let username = usernameInput.value;
    let email = emailInput.value;
    let password = passwordInput.value;
    let repeatPassword = repeatPasswordInput.value;

    // Checking that all fields are non-empty and that passwords match
    if (username.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0 || repeatPassword.trim().length === 0){
        alert("Field is empty");
        return;
    }
    if (password !== repeatPassword){
        alert("Passwords don't match");
        return;
    }

    const registerBody = { username, email, password };
    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(registerBody)
    };
    try {
        const response = await fetch(`${BASE_URL}/register`, requestOptions);
        const status = response.status;
        if (status === 201){
            window.location.href = "../login/login-page.html";
        }
        else if (status === 409) {
            alert("Username or email already exists!");
        }
        else {
            alert("Registration failed. Something went wrong.");
        }
    } catch (error) {
        console.log(error);
        alert("An error has occurred.");
    }
}
