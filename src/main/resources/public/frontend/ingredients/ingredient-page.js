/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
const addIngredientSubmitButton = document.getElementById("add-ingredient-submit-button");
const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const deleteIngredientSubmitButton = document.getElementById("delete-ingredient-submit-button");
const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const ingredientListContainer = document.getElementById("ingredient-list");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addIngredientSubmitButton.addEventListener("click", addIngredient);
deleteIngredientSubmitButton.addEventListener("click", deleteIngredient);

/*
 * TODO: Create an array to keep track of ingredients
 */

let ingredients = [];


/* 
 * TODO: On page load, call getIngredients()
 */
getIngredients();


/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    let newIngredientName = addIngredientNameInput.value.trim();
    if (newIngredientName.length === 0){
        alert("Ingredient is empty.");
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
    body: JSON.stringify({name: newIngredientName})
    };
    try {
        const response = await fetch(`${BASE_URL}/ingredients`);
        const status = response.status;
        if (status === 201){
            console.log("Ingredient received!");
            addIngredientNameInput.value = "";
            getIngredients();
        }
        else {
            alert("Failed to retrieve ingredients.");
        }
    } catch (error) {
        console.log(error);
        alert("An error has occurred.");
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    try {
        const response = await fetch(`${BASE_URL}/ingredients`);
        const status = response.status;
        if (status === 200){
            ingredients = await response.json();
            refreshIngredientList();
        }
        else{
            console.log("No ingredients found.");
        }
    } catch (error) {
        console.log(error);
        alert("An error has occurred.");
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    let deleteIngredientName = deleteIngredientNameInput.value.trim();
    if (deleteIngredientName.length === 0){
        alert("No ingredient provided.");
        return;
    }
    let ingredientIndex = 1;
    for (const li of ingredientListContainer.querySelectorAll("li")){
        const p = li.querySelector("p");
        if (deleteIngredientName === p.textContent){
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
            try {
                const response = await fetch(`${BASE_URL}/ingredients/${ingredientIndex}`, requestOptions);
                const status = response.status;
                if (status === 204){
                    deleteIngredientNameInput.value="";
                    getIngredients();
                }
            } catch (error) {
                console.log(error);
                alert("An error has occurred.");
            }
            // console.log("Match found!");
            // break;
        }
        ingredientIndex++;
    }
    // try {
    //     const response = await fetch(`${BASE_URL}/ingredients?term=${deleteIngredientName}`);
    //     const status = response.status;
    //     if (status === 200){
    //         const myIngredients = await response.text();
    //         console.log("Ingredient has been found!");
    //         console.log(myIngredients);
    //     }
    //     else {
    //         console.log("Ingredient was not found.");
    //     }
    // } catch (error) {
    //     console.log(error);
    //     alert("An error has occurred.");
    // }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientListContainer.replaceChildren();
    for (let obj of ingredients){
        const listItem = document.createElement("li");
        const p = document.createElement("p");
        p.textContent = obj.name;
        listItem.appendChild(p);
        ingredientListContainer.appendChild(listItem);
    }
}
