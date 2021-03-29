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
let transactionRow;

// Regex to ensure that the number amount only contains "$", digits, and "."
let regex = /^\$?\d+(,\d{3})*\.?[0-9]?[0-9]?$/;

let budgetCategoriesAll = {}
let inputTransactionsAll
let transListFromCSV

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

let givingTransAmt = 0;
let housingTransAmt = 0;
let transportationTransAmt = 0;
let foodTransAmt = 0;
let personalTransAmt = 0;
let lifestyleTransAmt = 0;
let healthTransAmt = 0;
let debtTransAmt = 0;
let billsTransAmt = 0;
let totalTransAmt = 0;

let rowContentFromCSV;
let select;
let fragment;
let option;
let approveCell;
let approveBtn;
let deleteCell;
let deleteBtn;
let transListSelectedOption;
let approveBtnsInDOM;
let deleteBtnsInDOM;

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
    `<tr class="transactionRow" id="${id}">
      <td class="transCatCell">${category}</td>
      <td>${merchant}</td>
      <td>${date}</td>
      <td>${amount}</td>
    </tr>`;

  const position = "afterend";
  // The entry variable content will be placed "afterbegin" (at the top of the list) of the HTML location passed into the function
  list.insertAdjacentHTML(position, entry);

}

function showTransEntryCSV(list, category, merchant, date, amount, id){

  const entry = 
    `<tr class="transactionRowCSV" id="${id}">
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
function calculateTotalBudget(family, list){
  let sum = 0;

  list.forEach( entry => {
      if( entry.family == family ){
          sum += entry.amount;
      }
  })

  return sum;
}

// function calculateTotalTrans(category, list){
//   if (transactionList.transCategory === )
//   let sum = 0;

//   list.forEach( entry => {
//       if( entry.transCategory == category ){
//           sum += entry.transAmount;
//       }
//   })

//   return sum;
// }

function readCSVUpload(file) {
  let reader = new FileReader();
  reader.readAsText(file);
}

totalBudgetedNum.insertAdjacentHTML("beforeend", `
<p>Total Budget: ${totalBudgetAmt}</p>
<p>Giving Budget: ${givingBudgetAmt}</p>
<p>Housing Budget: ${housingBudgetAmt}</p>
<p>Transportation Budget: ${transportationBudgetAmt}</p>
<p>Food Budget: ${foodBudgetAmt}</p>
<p>Personal Budget: ${personalBudgetAmt}</p>
<p>Lifestyle Budget: ${lifestyleBudgetAmt}</p>
<p>Health Budget: ${healthBudgetAmt}</p>
<p>Debt Budget: ${debtBudgetAmt}</p>
<p>Bills Budget: ${billsBudgetAmt}</p>
`);


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
          givingBudgetAmt = calculateTotalBudget("Giving", budgetCategoryList); 
          break;
        case "Housing":
          housingCatList.push(budgetCategoriesAll);
          budgetCategoryList.push(budgetCategoriesAll);
          housingBudgetAmt = calculateTotalBudget("Housing", budgetCategoryList);          
          break;  
        case "Transportation":
          transportationCatList.push(budgetCategoriesAll);
          budgetCategoryList.push(budgetCategoriesAll);
          transportationBudgetAmt = calculateTotalBudget("Transportation", budgetCategoryList);          
          break;
        case "Food":
          foodCatList.push(budgetCategoriesAll);
          budgetCategoryList.push(budgetCategoriesAll);
          foodBudgetAmt = calculateTotalBudget("Food", budgetCategoryList);          
          break;   
        case "Personal":
          personalCatList.push(budgetCategoriesAll);
          budgetCategoryList.push(budgetCategoriesAll);
          personalBudgetAmt = calculateTotalBudget("Personal", budgetCategoryList);          
          break; 
        case "lifestyle":
          lifestyleCatList.push(budgetCategoriesAll);
          budgetCategoryList.push(budgetCategoriesAll);
          lifestyleBudgetAmt = calculateTotalBudget("Lifestyle", budgetCategoryList);          
          break;  
        case "Health":
          healthCatList.push(budgetCategoriesAll);
          budgetCategoryList.push(budgetCategoriesAll);
          healthBudgetAmt = calculateTotalBudget("Health", budgetCategoryList);          
          break;
        case "Debt":
          debtCatList.push(budgetCategoriesAll);
          budgetCategoryList.push(budgetCategoriesAll);
          debtBudgetAmt = calculateTotalBudget("Debt", budgetCategoryList);          
          break;
        case "Bills":
          billsCatList.push(budgetCategoriesAll);
          budgetCategoryList.push(budgetCategoriesAll);
          billsBudgetAmt = calculateTotalBudget("Bills", budgetCategoryList);          
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
      totalBudgetedNum.insertAdjacentHTML("beforeend", `
<p>Total Budget: ${totalBudgetAmt}</p>
<p>Giving Budget: ${givingBudgetAmt}</p>
<p>Housing Budget: ${housingBudgetAmt}</p>
<p>Transportation Budget: ${transportationBudgetAmt}</p>
<p>Food Budget: ${foodBudgetAmt}</p>
<p>Personal Budget: ${personalBudgetAmt}</p>
<p>Lifestyle Budget: ${lifestyleBudgetAmt}</p>
<p>Health Budget: ${healthBudgetAmt}</p>
<p>Debt Budget: ${debtBudgetAmt}</p>
<p>Bills Budget: ${billsBudgetAmt}</p>
`);
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
      inputTransactionsAll = {
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
      
      // const solution = budgetCategoryList.filter((category) => category.category === transactionList.transCategory);

      switch (transactionList.family) {
        case "Giving":
          // givingtTransAmt.push(inputTransactionsAll);
          // totalTransAmt.push(inputTransactionsAll);
          givingTransAmt = calculateTotalTrans("Giving", transactionList); 
          break;
        case "Housing":
          housingTransAmt = calculateTotalTrans("Housing", transactionList);          
          break;  
        case "Transportation":
          transportationTransAmt = calculateTotalTrans("Transportation", transactionList);          
          break;
        case "Food":
          foodTransAmt = calculateTotalTrans("Food", transactionList);          
          break;   
        case "Personal":
          personalTransAmt = calculateTotalTrans("Personal", transactionList);          
          break; 
        case "lifestyle":
          personalTransAmt = calculateTotalTrans("Lifestyle", transactionList);          
          break;  
        case "Health":
          healthTransAmt = calculateTotalTrans("Health", transactionList);          
          break;
        case "Debt":
          debtTransAmt = calculateTotalTrans("Debt", transactionList);          
          break;
        case "Bills":
          billsTransAmt = calculateTotalTrans("Bills", transactionList);          
          break;  
      }
    }
});

// Biggest thing is to add the CSV reading abilities
csvFileUpload.addEventListener("change", function(e) {
  const reader = new FileReader();
  reader.onload = function () {
    const lines = reader.result.split("\n").map(function (line) {
      return line.split(",")
    })
    rowContentFromCSV = lines.slice(1);
    rowContentFromCSV.reverse();
    for (i =0; i < rowContentFromCSV.length; i++) {
      transListFromCSV = {}; 
      transListFromCSV.transCategory = "";
      transListFromCSV.merchantName = rowContentFromCSV[i][1];
      transListFromCSV.transDate = rowContentFromCSV[i][2];
      transListFromCSV.transAmount = Math.round(parseFloat(rowContentFromCSV[i][3]));
      transArrFromCSV.push(transListFromCSV)
    }
    transArrFromCSV.forEach( (entry, index) => {
      showTransEntryCSV(transTableRowsFromCSV, entry.transCategory, entry.merchantName, entry.transDate, entry.transAmount, index);
    });
    
    tableFromCSV = document.querySelector("#tableFromCSV");
    tableFromCSV.insertAdjacentHTML("beforebegin",
      `<button type="button" id="buttonToAddCategory">Click to Add Category</button>`
    );

    buttonToAddCategory = document.querySelector("#buttonToAddCategory");
    transCatCell = document.querySelectorAll(".transCatCell");

    select = document.createElement("select");
    fragment = document.createDocumentFragment();

    budgetCategoryList.forEach((category) => {
      option = document.createElement("option");
      option.textContent = category.category;
      option.value = category.category;
      fragment.appendChild(option);
    });

    select.appendChild(fragment);
    select.className = "transListSelectedOption";

    approveCell = document.createElement("td");
    approveBtn = document.createElement("button");
    approveBtn.textContent = "Approve";
    approveBtn.className = "approveBtns";
    approveCell.appendChild(approveBtn);

    deleteCell = document.createElement("td");
    deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "deleteBtns";
    deleteCell.appendChild(deleteBtn);

    transCatCell.forEach((category) => {
      category.appendChild(select.cloneNode(true));
      category.parentNode.appendChild(approveCell.cloneNode(true));
      category.parentNode.appendChild(deleteCell.cloneNode(true));
    });
    transListSelectedOption = document.querySelectorAll(".transListSelectedOption");
    approveBtnsInDOM = document.querySelectorAll(".approveBtns");
    deleteBtnsInDOM = document.querySelectorAll(".deleteBtns");
    console.log(transListSelectedOption[0].value);
    console.log(approveBtnsInDOM);
    console.log(transArrFromCSV[0]);
    
    transactionRow = document.querySelectorAll(".transactionRow");
    for (let i = 0; i < transArrFromCSV.length; i++) {
      approveBtnsInDOM[i].addEventListener("click", function(e) {
        transArrFromCSV[i].transCategory = transListSelectedOption[i].value;
        transactionList.push(transArrFromCSV[i]);
        clearElement(transCatCell[i].parentNode);
        for (let j = 0; j < transactionRow.length; j++) {
          transactionRow[j].innerHTML = ""
          transTable.innerHTML = ""
        }
        transactionList.forEach( (entry, index) => {
        showTransEntry(transTable, entry.transCategory, entry.merchantName, entry.transDate, entry.transAmount, index);
        });
      })
      deleteBtnsInDOM[i].addEventListener("click", function(e) {
        transArrFromCSV.splice(i);
        clearElement(transCatCell[i].parentNode);
      })
    }

  }
  reader.readAsText(csvFileUpload.files[0]);
}, false);