/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const adminLink = document.getElementById("admin-link");
    const logoutButton = document.getElementById("logout-button");
    const recipeList = document.getElementById("recipe-list");

    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");

    const addRecipeNameInput = document.getElementById("add-recipe-name-input");
    const addRecipeInstructionsInput = document.getElementById("add-recipe-instructions-input");
    const addButton = document.getElementById("add-recipe-submit-input");

    const updateRecipeNameInput = document.getElementById("update-recipe-name-input");
    const updateRecipeInstructionsInput = document.getElementById("update-recipe-instructions-input");
    const updateButton = document.getElementById("update-recipe-submit-input");

    const deleteRecipeNameInput = document.getElementById("delete-recipe-name-input");
    const deleteButton = document.getElementById("delete-recipe-submit-input");


    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    let authToken = sessionStorage.getItem("auth-token");
    if (authToken){
        logoutButton.style.display = "block";
    }

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    let isAdmin = sessionStorage.getItem("is-admin");
    if (isAdmin){
        adminLink.style.display = "inline";
    }

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addButton.addEventListener("click", addRecipe);
    updateButton.addEventListener("click", updateRecipe);
    deleteButton.addEventListener("click", deleteRecipe);
    searchButton.addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        let searchTerm = searchInput.value;
        try {
            const response = await fetch(`${BASE_URL}/recipes?name=${searchTerm}`);
            const status = response.status;
            if (status === 200){
                recipes = await response.json();
                refreshRecipeList();
            }
            else { 
                console.log("Recipes couldn't be found.");
            }
        } catch (error) {
            console.log(error);
            alert("An error has occurred.");
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        let newRecipeName = addRecipeNameInput.value;
        let newRecipeInstructions = addRecipeInstructionsInput.value;
        if (newRecipeName.trim().length === 0 || newRecipeInstructions.trim().length === 0){
            alert("Name or instructions is empty.");
            return;
        }
        const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("auth-token"),
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({name: newRecipeName, instructions: newRecipeInstructions})
        };
        try {
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions);
            const status = response.status;
            if (status === 201){
                console.log("Recipe received!");
                addRecipeNameInput.value = "";
                addRecipeInstructionsInput.value = "";
                getRecipes();
            }
            else {
                console.log("Something went wrong.");
            }
        } catch (error) {
            console.log(error);
            alert("An error has occurred.");
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        let updateRecipeName = updateRecipeNameInput.value;
        let updateRecipeInstructions = updateRecipeInstructionsInput.value;
        if (updateRecipeName.trim().length === 0 || updateRecipeInstructions.trim().length === 0){
            alert("Name or instructions is empty.");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/recipes?name=${updateRecipeName}`);
            const status = response.status;
            if (status === 200){
                let responseJson = await response.json();
                let foundRecipe = responseJson[0];
                const requestOptions = {
                method: "PUT",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token"),
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*"
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify({name: updateRecipeName, instructions: updateRecipeInstructions})
                };
                const putResponse = await fetch(`${BASE_URL}/recipes/${foundRecipe.id}`, requestOptions);
                if (putResponse.status === 200){
                    addRecipeNameInput.value = "";
                    addRecipeInstructionsInput.value = "";
                    getRecipes();
                }
            }
            else {
                console.log("Recipe name did not match existing recipes.");
            }
        } catch (error) {
            console.log(error);
            alert("An error has occurred.");
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        let deleteRecipeName = deleteRecipeNameInput.value;
        if (deleteRecipeName.trim().length === 0){
            alert("Name is empty.");
            return;
        }
        if (!isAdmin){
            alert("Cannot delete recipe!");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/recipes?name=${deleteRecipeName}`);
            const status = response.status;
            if (status === 200){
                let responseJson = await response.json();
                let foundRecipe = responseJson[0];
                const requestOptions = {
                method: "DELETE",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token"),
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*"
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                };
                const deleteResponse = await fetch(`${BASE_URL}/recipes/${foundRecipe.id}`, requestOptions);
                if (deleteResponse.status === 200){
                    deleteRecipeNameInput.value = "";
                    getRecipes();
                }
            }
            else {
                console.log("Recipe name did not match existing recipes.");
            }
        } catch (error) {
            console.log(error);
            alert("An error has occurred.");
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        try {
            const response = await fetch(`${BASE_URL}/recipes`);
            const status = response.status;
            if (status === 200){
                recipes = await response.json();
                refreshRecipeList();
            }
            else {
                console.log("No recipes found.");
            }
        } catch (error) {
            console.log(error);
            alert("An error has occurred.");
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        recipeList.replaceChildren();
        for (let obj of recipes){
            const listItem = document.createElement("li");
            listItem.textContent = `${obj.name}: ${obj.instructions}`;
            recipeList.appendChild(listItem);
        }
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
        const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("auth-token"),
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        };
        try {
            const response = await fetch(`${BASE_URL}/logout`, requestOptions);
            const status = response.status;
            if (status === 200){
                sessionStorage.clear();
                setTimeout(() => {
                    window.location.href = "../login/login-page.html";
                }, 500);
            }
            else {
                alert("Unable to logout.");
            }
        } catch (error) {
            console.log(error);
            alert("An error has occurred.");
        }
    }

});
