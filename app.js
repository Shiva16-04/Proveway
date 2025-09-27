import { generateDiscountCardInterface, addEventListeners } from "./helper.js";


//calling the final functions
try{
    generateDiscountCardInterface();
    addEventListeners();
}catch (error) {
    console.log("Exception occured at :", error);
}



