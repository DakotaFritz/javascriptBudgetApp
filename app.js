// I want a title on the page and then two columns of content.
// Ideally, I want the right side to be the summary and maybe have visualization to it.
// I want the right side to be static and the left side to scroll.
// I want the right side to contain the total numbers for each category.
// I want a file upload button in the top right.
// I want a way to indicate that I only can handle CSV files.
// I want an input transaction button to be next to the file upload button.
// I want to show each category of transaction and the transactions within the category listed down in whatever specific order
// I want a floating "Edit" button to follow the cursor down the page and then transforms those fields to input or drop-down menu (for category)

// Grab the HTML fields by id for manipulating later
let budgetCatFamily = document.querySelector("#family");
let budgetCategory = document.querySelector("#category");
let budgetCatAmt = document.querySelector("#budgetedAmt");
let categoriesListOfItems = document.querySelector("#categoriesListOfItems");
let addCategoryToList = document.querySelector("#addCategoryToList");

// Regex to ensure that the number amount only contains "$", digits, and "."
let regex = /^\$?\d+(,\d{3})*\.?[0-9]?[0-9]?$/;

// The Array that will contain the budget category objects later on
let budgetCategoryList = [];
let categoryOptions = [];


// The arrays for each family of categories to live in
let givingCatList = [];
let housingCatList = [];
let transportationCatList = [];
let foodCatList = [];
let personalCatList = [];
let lifestyleCatList = [];
let healthCatList = [];
let debtCatList = [];
let billsCatList = [];

// Need to find a way to calculate the total
let totalBudgetAmt = calculateTotal("*", budgetCategoryList);
let givingBudgetAmt = calculateTotal("Giving", budgetCategoryList);
let housingBudgetAmt = calculateTotal("Housing", budgetCategoryList);
let transportationBudgetAmt = calculateTotal("Transportation", budgetCategoryList);
let foodBudgetAmt = calculateTotal("Food", budgetCategoryList);
let personalBudgetAmt = calculateTotal("Personal", budgetCategoryList);
let lifestyleBudgetAmt = calculateTotal("Lifestyle", budgetCategoryList);
let healthBudgetAmt = calculateTotal("Health", budgetCategoryList);
let debtBudgetAmt = calculateTotal("Debt", budgetCategoryList);
let billsBudgetAmt = calculateTotal("Bills", budgetCategoryList);

// Function to clear the input fields upon submitting the input
function clearInput(inputsArray) {
  inputsArray.forEach( input => {
    input.value = "";
  });
};

// Function to convert string input into Title Case
function inputToTitleCase(str) {
  return str.toLowerCase().replace(/(?:^|\s|-|_)\w/g, function(match) {
   return match.toUpperCase();
  })
};

// Needs more work to be able to not add duplicate inputs on the page
function updatePage(){
  givingBudgetAmt;
  housingBudgetAmt;
  transportationBudgetAmt;
  foodBudgetAmt;
  personalBudgetAmt;
  lifestyleBudgetAmt;
  healthBudgetAmt;
  debtBudgetAmt;
  billsBudgetAmt;

  // localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

// Function to take information from the input category object and display it as a list item in the HTML
function showEntry(list, type, title, amount, id){

  const entry = `<li id = "${id}" class="${type}">
                      <div class="entry">${title}: $${amount}</div>
                      <div id="edit"></div>
                      <div id="delete"></div>
                  </li>`;

  const position = "afterbegin";
  // The entry variable content will be placed "afterbegin" (at the top of the list) of the HTML location passed into the function
  list.insertAdjacentHTML(position, entry);
}

// Function to calculate total for a budget category
function calculateTotal(family, list){
  let sum = 0;

  list.forEach( entry => {
      if( entry.family == family ){
          sum += entry.amount;
      }
  })

  return sum;
}

// On the click event, trigger actions with the input
addCategoryToList.addEventListener("click", function() {

  // If any of the three input fields are empty
  if( !budgetCatFamily || !budgetCategory || !budgetCatAmt ) return;
  // If Amount input does not pass Regex test, show alert and stop running code below
  if(regex.test(budgetCatAmt.value) === false) {
    alert("Please enter a numeric value such as the following, in the Amount box: $100.50, $100, 100, etc.");
    return; } 
    // Otherwise, append Family, Category, and Amount to variable as an Object
    else {
      let budgetCategoriesAll = {
        family: budgetCatFamily.value,
        category: inputToTitleCase(budgetCategory.value),
        amount: parseFloat(budgetCatAmt.value)
      };
      // Push the object containing the input category into the Array that was created above
      budgetCategoryList.push(budgetCategoriesAll);
      // Clear the input in each field
      clearInput([budgetCatFamily, budgetCategory, budgetCatAmt]);
      // For each object, show the input on the page through the showEntry function
      budgetCategoryList.forEach( (entry, index) => {
        showEntry(categoriesListOfItems, entry.family, entry.category, entry.amount, index);
      });

      for (let i = 0; i < budgetCategoryList.length; i++) {
        categoryOptions.push(budgetCategoryList[i].category)
      };
    }
});

// Transactions

