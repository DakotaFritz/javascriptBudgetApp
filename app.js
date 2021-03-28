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
let totalBudgetedNum = document.querySelector("#totalBudgetedNumber");
let budgetCatFamily = document.querySelector("#family");
let budgetCategory = document.querySelector("#category");
let budgetCatAmt = document.querySelector("#budgetedAmt");
let categoriesListOfItems = document.querySelector("#categoriesListOfItems");
let addCategoryToList = document.querySelector("#addCategoryToList");
let transactionCategory = document.querySelector("#transactionCategory");
let merchantName = document.querySelector("#merchantName");
let transDate = document.querySelector("#transDate");
let transAmt = document.querySelector("#transAmt");
let addTransactionToList = document.querySelector("#addTransactionToList");
let csvFileUpload = document.querySelector("#csvFileUpload");
let transTable = document.querySelector("#transTable");
let tableFromCSV;
let transTableRowsFromCSV = document.querySelector("#transTableRowsFromCSV");
let transCatCell;
let buttonToAddCategory;

// Regex to ensure that the number amount only contains "$", digits, and "."
let regex = /^\$?\d+(,\d{3})*\.?[0-9]?[0-9]?$/;

let budgetCategoriesAll = {}

// The Array that will contain the budget category objects later on
// let budgetCategoryList = givingCatList + housingCatList + transportationCatList + foodCatList + personalCatList + lifestyleCatList + healthCatList + debtCatList + billsCatList;
let currentCategoryOption = "";
let transactionList = [];
let transArrFromCSV = [];

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
let budgetCategoryList = [];

// Need to find a way to calculate the total
let givingBudgetAmt = 0;
let housingBudgetAmt = 0;
let transportationBudgetAmt = 0;
let foodBudgetAmt = 0;
let personalBudgetAmt = 0;
let lifestyleBudgetAmt = 0;
let healthBudgetAmt = 0;
let debtBudgetAmt = 0;
let billsBudgetAmt = 0;
let totalBudgetAmt = 0;

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
function showCatEntry(list, type, title, amount, id){

  const entry = `<li id = "${id}" class="${type}">
                      <div class="entry">${title}: $${amount}</div>
                      <div id="edit"></div>
                      <div id="delete"></div>
                  </li>`;

  const position = "afterbegin";
  // The entry variable content will be placed "afterbegin" (at the top of the list) of the HTML location passed into the function
  list.insertAdjacentHTML(position, entry);
}

// Function to take information from the input category object and display it as a list item in the HTML
function showTransEntry(list, category, merchant, date, amount, id){

  const entry = 
    `<tr id="${id}">
      <td class="transCatCell">${category}</td>
      <td>${merchant}</td>
      <td>${date}</td>
      <td>${amount}</td>
    </tr>`;

  const position = "afterend";
  // The entry variable content will be placed "afterbegin" (at the top of the list) of the HTML location passed into the function
  list.insertAdjacentHTML(position, entry);

  
}

function clearElement(element){
      element.innerHTML = "";
}

function clearObject (object) {
  for (let key in object) {
    key = ""
  }
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

function readCSVUpload(file) {
  let reader = new FileReader();
  reader.readAsText(file);
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
      budgetCategoriesAll = {
        family: budgetCatFamily.value,
        category: inputToTitleCase(budgetCategory.value),
        amount: Math.round(parseFloat(budgetCatAmt.value))
      };
      // Determine the family array to append the input category to
      switch (budgetCategoriesAll.family) {
        case "Giving":
          givingCatList.push(budgetCategoriesAll);
          budgetCategoryList.push(budgetCategoriesAll);
          givingBudgetAmt = calculateTotal("Giving", budgetCategoryList); 
          break;
        case "Housing":
          housingCatList.push(budgetCategoriesAll);
          budgetCategoryList.push(budgetCategoriesAll);
          housingBudgetAmt = calculateTotal("Housing", budgetCategoryList);          
          break;  
        case "Transportation":
          transportationCatList.push(budgetCategoriesAll);
          budgetCategoryList.push(budgetCategoriesAll);
          transportationBudgetAmt = calculateTotal("Transportation", budgetCategoryList);          
          break;
        case "Food":
          foodCatList.push(budgetCategoriesAll);
          budgetCategoryList.push(budgetCategoriesAll);
          foodBudgetAmt = calculateTotal("Food", budgetCategoryList);          
          break;   
        case "Personal":
          personalCatList.push(budgetCategoriesAll);
          budgetCategoryList.push(budgetCategoriesAll);
          personalBudgetAmt = calculateTotal("Personal", budgetCategoryList);          
          break; 
        case "lifestyle":
          lifestyleCatList.push(budgetCategoriesAll);
          budgetCategoryList.push(budgetCategoriesAll);
          lifestyleBudgetAmt = calculateTotal("Lifestyle", budgetCategoryList);          
          break;  
        case "Health":
          healthCatList.push(budgetCategoriesAll);
          budgetCategoryList.push(budgetCategoriesAll);
          healthBudgetAmt = calculateTotal("Health", budgetCategoryList);          
          break;
        case "Debt":
          debtCatList.push(budgetCategoriesAll);
          budgetCategoryList.push(budgetCategoriesAll);
          debtBudgetAmt = calculateTotal("Debt", budgetCategoryList);          
          break;
        case "Bills":
          billsCatList.push(budgetCategoriesAll);
          budgetCategoryList.push(budgetCategoriesAll);
          billsBudgetAmt = calculateTotal("Bills", budgetCategoryList);          
          break;  
      }

      totalBudgetAmt = givingBudgetAmt + housingBudgetAmt + transportationBudgetAmt + foodBudgetAmt + personalBudgetAmt + lifestyleBudgetAmt + healthBudgetAmt + debtBudgetAmt + billsBudgetAmt;

      // Clear the input in each field
      clearInput([budgetCatFamily, budgetCategory, budgetCatAmt]);
      // For each object, show the input on the page through the showEntry function
      clearElement(categoriesListOfItems);
      budgetCategoryList.forEach( (entry, index) => {
        showCatEntry(categoriesListOfItems, entry.family, entry.category, entry.amount, index);
      });

      currentCategoryOption = budgetCategoriesAll.category
      transactionCategory.insertAdjacentHTML( "afterbegin",
        `<option value="${currentCategoryOption}">${currentCategoryOption}</option>`
      );

      clearObject(budgetCategoriesAll);

      clearElement(totalBudgetedNum);
      totalBudgetedNum.insertAdjacentHTML("beforeend", `${totalBudgetAmt}`);
    }
  });


// Transactions

addTransactionToList.addEventListener("click", function() {

  // If any of the three input fields are empty
  if( !transactionCategory || !merchantName || !transDate || !transAmt ) return;
  // If Amount input does not pass Regex test, show alert and stop running code below
  if(regex.test(transAmt.value) === false) {
    alert("Please enter a numeric value such as the following, in the Amount box: $100.50, $100, 100, etc.");
    return; } 
    // Otherwise, append Family, Category, and Amount to variable as an Object
    else {
      let inputTransactionsAll = {
        transCategory: transactionCategory.value,
        merchantName: merchantName.value,
        transDate: transDate.value,
        transAmount: Math.round(parseFloat(transAmt.value))
      };
      // Push the object containing the input category into the Array that was created above
      transactionList.push(inputTransactionsAll);

      // Clear the input in each field
      clearInput([transactionCategory, merchantName, transDate, transAmt]);
      // For each object, show the input on the page through the showEntry function
      transactionList.forEach( (entry, index) => {
        showTransEntry(transTable, entry.transCategory, entry.merchantName, entry.transDate, entry.transAmount, index);
      });
    }
});

// Biggest thing is to add the CSV reading abilities
csvFileUpload.addEventListener("change", function(e) {
  const reader = new FileReader();
  reader.onload = function () {
    const lines = reader.result.split("\n").map(function (line) {
      return line.split(",")
    })
    let headersFromCSV = lines[0];
    let rowContentFromCSV = lines.slice(1);
    for (i =0; i < rowContentFromCSV.length; i++) {
      let transListFromCSV = {}; 
      transListFromCSV.transCategory = "";
      transListFromCSV.merchantName = rowContentFromCSV[i][1];
      transListFromCSV.transDate = rowContentFromCSV[i][2];
      transListFromCSV.transAmount = Math.round(parseFloat(rowContentFromCSV[i][3]));
      transArrFromCSV.push(transListFromCSV)
    }
    transArrFromCSV.forEach( (entry, index) => {
      showTransEntry(transTableRowsFromCSV, entry.transCategory, entry.merchantName, entry.transDate, entry.transAmount, index);
    });
    
    tableFromCSV = document.querySelector("#tableFromCSV");
    tableFromCSV.insertAdjacentHTML("beforebegin",
      `<button type="button" id="buttonToAddCategory">Click to Add Category</button>`
    );

    buttonToAddCategory = document.querySelector("#buttonToAddCategory");
    transCatCell = document.querySelectorAll(".transCatCell");

    let select = document.createElement("select");
    let fragment = document.createDocumentFragment();

    budgetCategoryList.forEach((category) => {
      let option = document.createElement("option");
      option.textContent = category.category;
      fragment.appendChild(option);
    });

    select.appendChild(fragment);
    select.className = "transListSelectedOption";

    let approveCell = document.createElement("td");
    let approveBtn = document.createElement("button");
    approveBtn.textContent = "Approve";
    approveCell.appendChild(approveBtn);

    let deleteCell = document.createElement("td");
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteCell.appendChild(deleteBtn);

    buttonToAddCategory.addEventListener("click", () => {
      transCatCell.forEach((category) => {
          category.appendChild(select.cloneNode(true));
          category.parentNode.appendChild(approveCell.cloneNode(true));
          category.parentNode.appendChild(deleteCell.cloneNode(true));
        });
    });

    let transListSelectedOption = document.querySelectorAll("#transListSelectedOption");

    approveBtn.addEventListener("click", () => {
      // transArrFromCSV.forEach((entry) => {
      //   entry.transCategory = transListSelectedOption;
      // })
    })
  }
  reader.readAsText(csvFileUpload.files[0]);
}, false);

