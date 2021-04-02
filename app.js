// Each of these variables grabs a DOM Element or nodeList. Some are declared here and changed later inside of a function
const totalBudgetedNum = document.querySelector("#totalBudgetedNumber");
const budgetedChart = document.querySelector("#budgetedChart");
const budgetCatFamily = document.querySelector("#family");
const budgetCategory = document.querySelector("#category");
const budgetCatAmt = document.querySelector("#budgetedAmt");
const categoriesListOfItems = document.querySelector("#categoriesListOfItems");
const addCategoryToList = document.querySelector("#addCategoryToList");
const transactionCategory = document.querySelector("#transactionCategory");
const merchantName = document.querySelector("#merchantName");
const transDate = document.querySelector("#transDate");
const transAmt = document.querySelector("#transAmt");
const addTransactionToList = document.querySelector("#addTransactionToList");
const csvFileUpload = document.querySelector("#csvFileUpload");
const transTable = document.querySelector("#transTable");
const transTableBody = transTable.parentElement;
let tableFromCSV;
const transTableRowsFromCSV = document.querySelector("#transTableRowsFromCSV");
let transCatCell;
let transactionRow;

// Regex to ensure that the number amount only contains "$", digits, and "."
const regex = /^\$?\d+(,\d{3})*\.?[0-9]?[0-9]?$/;

// Declare the objects that categories, transactions, and transactions from the CSV upload go into
let budgetCategoriesAll = {};
let inputTransactionsAll = {};
let transListFromCSV = {};

// Declare the variables that will contain the arrays of transactions for later on, as well as the currentCategoryoption
let currentCategoryOption = "";
let transactionList = [];
let transArrFromCSV = [];

// Declare the variables that will hold hold categories that belong to each family, as well as the overall category list
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

// Declare variables for amount budgeted to each category within each family, as well as the total budget number
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

// Declare variables for transaction amounts for each category within each family, as well as the total transaction amount
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

// Declare variables for the difference between budgeted amount and transaction amount within each family, as well as the total difference
let givingDifference = 0;
let housingDifference = 0;
let transportationDifference = 0;
let foodDifference = 0;
let personalDifference = 0;
let lifestyleDifference = 0;
let healthDifference = 0;
let debtDifference = 0;
let billsDifference = 0;
let totalDifference = 0;

// Declare variables to be used in the CSV reader event listener
let rowContentFromCSV;
let select;
let fragment;
let option;
let approveCell;
let approveBtn;
let transListSelectedOption;
let approveBtnsInDOM;

// Function to clear the input fields upon submitting the input
function clearInput(inputsArray) {
  inputsArray.forEach( input => {
    input.value = "";
  });
};

function clearSelectOption(element) {
  element.value = "none";
}

// Function to convert string input into Title Case
function inputToTitleCase(str) {
  return str.toLowerCase().replace(/(?:^|\s|-|_)\w/g, function(match) {
   return match.toUpperCase();
  })
};

// Function to take information from the input category object and display it as a list item in the HTML
function showTransEntry(element, family, category, merchant, date, amount, id){

  const entry = 
    `<tr class="transactionRow" id="${id}">
      <td>${family}
      <td>${category}</td>
      <td>${merchant}</td>
      <td>${date}</td>
      <td>${convertToDollar(amount)}</td>
    </tr>`;

  const position = "afterend";
  // The entry variable content will be placed "afterbegin" (at the top of the element) of the HTML location passed into the function
  element.insertAdjacentHTML(position, entry);

}

function showTransEntryCSV(element, category, merchant, date, amount, id){

  const entry = 
    `<tr class="transactionRowCSV" id="${id}">
      <td class="transCatCell">${category}</td>
      <td>${merchant}</td>
      <td>${date}</td>
      <td>${convertToDollar(amount)}</td>
    </tr>`;

  const position = "beforeend";
  // The entry variable content will be placed "beforeend" (at the top of the element) of the HTML location passed into the function
  element.insertAdjacentHTML(position, entry);
}

function clearElement(element){
      element.innerHTML = "";
}

function clearObject (object) {
  for (let key in object) {
    key = ""
  }
}

function convertToDollar (number) {
  return number.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
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

// Might end up changing the keys so this could just be combined with the function above because of the similarities
function calculateTotalTrans(family, list){
  let sum = 0;

  list.forEach( entry => {
      if( entry.catFamily == family ){
          sum += entry.transAmount;
      }
  })
  return sum;
}

// Should this be in the HTML instead? Not sure how to update on each event listener if so.
function updateBudgetNumbersPrintOut() {
  totalBudgetedNum.insertAdjacentHTML("beforeend", `
  <div id="calculatedContainer">
    <div id="tableDiv">
      <table id="calculatedTable">
        <thead>
            <tr>
                <th>Family of Category</th>
                <th>Planned</th>
                <th>Spent</th>
                <th>Left Over</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Giving</td>
                <td>${convertToDollar(givingBudgetAmt)}</td>
                <td>${convertToDollar(givingTransAmt)}</td>
                <td>${convertToDollar(givingDifference)}</td>
            </tr>
            <tr>
                <td>Housing</td>
                <td>${convertToDollar(housingBudgetAmt)}</td>
                <td>${convertToDollar(housingTransAmt)}</td>
                <td>${convertToDollar(housingDifference)}</td>
            </tr>
            <tr>
                <td>Transportation</td>
                <td>${convertToDollar(transportationBudgetAmt)}</td>
                <td>${convertToDollar(transportationTransAmt)}</td>
                <td>${convertToDollar(transportationDifference)}</td>
            </tr>
            <tr>
                <td>Food</td>
                <td>${convertToDollar(foodBudgetAmt)}</td>
                <td>${convertToDollar(foodTransAmt)}</td>
                <td>${convertToDollar(foodDifference)}</td>
            </tr>
            <tr>
                <td>Personal</td>
                <td>${convertToDollar(personalBudgetAmt)}</td>
                <td>${convertToDollar(personalTransAmt)}</td>
                <td>${convertToDollar(personalDifference)}</td>
            </tr>
            <tr>
                <td>Lifestyle</td>
                <td>${convertToDollar(lifestyleBudgetAmt)}</td>
                <td>${convertToDollar(lifestyleTransAmt)}</td>
                <td>${convertToDollar(lifestyleDifference)}</td>
            </tr>
            <tr>
                <td>Health</td>
                <td>${convertToDollar(healthBudgetAmt)}</td>
                <td>${convertToDollar(healthTransAmt)}</td>
                <td>${convertToDollar(healthDifference)}</td>
            </tr>
            <tr>
                <td>Debt</td>
                <td>${convertToDollar(debtBudgetAmt)}</td>
                <td>${convertToDollar(debtTransAmt)}</td>
                <td>${convertToDollar(debtDifference)}</td>
            </tr>
            <tr>
                <td>Bills</td>
                <td>${convertToDollar(billsBudgetAmt)}</td>
                <td>${convertToDollar(billsTransAmt)}</td>
                <td>${convertToDollar(billsDifference)}</td>
            </tr>
        </tbody>
        <tfoot>
          <tr id="calculatedFooterRow">
            <td><strong>Total</strong></td>
            <td><strong>${convertToDollar(totalBudgetAmt)}</strong></td>
            <td><strong>${convertToDollar(totalTransAmt)}</strong></td>
            <td><strong>${convertToDollar(totalDifference)}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
  `);
};
// First call to put it on the page
updateBudgetNumbersPrintOut();
let calculatedContainer = document.querySelector("#calculatedContainer");

let currentDate = new Date();
let maxDateString = currentDate.toLocaleDateString();
let minDateString = currentDate.setDate(currentDate.getDate()-90);

flatpickr(transDate, {
    dateFormat: "n/j/Y",
    minDate: minDateString,
    maxDate: maxDateString
});

new Chart(budgetedChart, {    
  type: "bar",
  // labels: ["Giving", "Housing", "Transportation", "Food", "Personal", "Lifestyle", "Health", "Debt", "Bills"],
  data: {
    labels: ["Giving", "Housing", "Transportation", "Food", "Personal", "Lifestyle", "Health", "Debt", "Bills"],
    datasets: [{
        label: 'Total Budgeted Amount',
        data: [givingBudgetAmt, housingBudgetAmt, transportationBudgetAmt, foodBudgetAmt, personalBudgetAmt, lifestyleBudgetAmt, healthBudgetAmt, debtBudgetAmt, billsBudgetAmt],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(295, 100, 64, 0.2)',
            'rgba(30, 192, 192, 0.2)',
            'rgba(34, 200, 255, 0.2)',
            'rgba(65, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(30, 192, 192, 0.2)',
            'rgba(34, 200, 255, 0.2)',
            'rgba(65, 159, 64, 0.2)'
        ],
        borderWidth: 1
    }, {
      // labels: ["Giving Transactions", "Housing Transactions", "Transportation Transactions", "Food Transactions", "Personal Transactions", "Lifestyle Transactions", "Health Transactions", "Debt Transactions", "Bills Transactions"],              
      data: [givingTransAmt, housingTransAmt, transportationTransAmt, foodTransAmt, personalTransAmt, lifestyleTransAmt, healthTransAmt, debtTransAmt, billsTransAmt],
      backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(295, 100, 64, 0.2)',
          'rgba(30, 192, 192, 0.2)',
          'rgba(34, 200, 255, 0.2)',
          'rgba(65, 159, 64, 0.2)'
      ],
      borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(30, 192, 192, 0.2)',
          'rgba(34, 200, 255, 0.2)',
          'rgba(65, 159, 64, 0.2)'
      ],
      borderWidth: 1
    }]
},
options: {
  legend: {
    display: false
  },
  scales: {
    yAxes: [{
      ticks: {
        suggestedMax: 500,
        min: 0,
        stepSize: 50
      }
    }]
  }
}
});

// On the click event, trigger actions with the input
addCategoryToList.addEventListener("click", function() {

  // If any of the three input fields are empty
  if( budgetCatFamily.value === "none" || !budgetCategory || !budgetCatAmt ) {
    alert("Please ensure that you have selected a family, category and budgeted amount."); 
    return};

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
        case "Lifestyle":
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

      totalDifference = totalBudgetAmt;
      givingDifference = givingBudgetAmt;
      housingDifference = housingBudgetAmt;
      transportationDifference = transportationBudgetAmt;
      foodDifference = foodBudgetAmt;
      personalDifference = personalBudgetAmt;
      lifestyleDifference = lifestyleBudgetAmt;
      healthDifference = healthBudgetAmt;
      debtDifference = debtBudgetAmt;
      billsDifference = billsBudgetAmt;

      // Clear the input in each field
      clearInput([budgetCategory, budgetCatAmt]);
      clearSelectOption(budgetCatFamily);

      // Create option element for each category in the transaction input
      currentCategoryOption = budgetCategoriesAll.category;
      currentCatFamily = budgetCategoriesAll.family;
      transactionCategory.insertAdjacentHTML( "afterbegin",
        `<option class="${currentCatFamily}"value="${currentCategoryOption}">${currentCategoryOption}</option>`
      );

      clearObject(budgetCategoriesAll);
      // I may change this up to be more accurate and eliminate the totalBudgetNum Id
      clearElement(totalBudgetedNum);
      updateBudgetNumbersPrintOut();

new Chart(budgetedChart, {    
  type: "bar",
  // labels: ["Giving", "Housing", "Transportation", "Food", "Personal", "Lifestyle", "Health", "Debt", "Bills"],
  data: {
    labels: ["Giving", "Housing", "Transportation", "Food", "Personal", "Lifestyle", "Health", "Debt", "Bills"],
    datasets: [{
        label: 'Total Budgeted Amount',
        data: [givingBudgetAmt, housingBudgetAmt, transportationBudgetAmt, foodBudgetAmt, personalBudgetAmt, lifestyleBudgetAmt, healthBudgetAmt, debtBudgetAmt, billsBudgetAmt],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(295, 100, 64, 0.2)',
            'rgba(30, 192, 192, 0.2)',
            'rgba(34, 200, 255, 0.2)',
            'rgba(65, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(30, 192, 192, 0.2)',
            'rgba(34, 200, 255, 0.2)',
            'rgba(65, 159, 64, 0.2)'
        ],
        borderWidth: 1
    }, {            
      data: [givingTransAmt, housingTransAmt, transportationTransAmt, foodTransAmt, personalTransAmt, lifestyleTransAmt, healthTransAmt, debtTransAmt, billsTransAmt],
      backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(295, 100, 64, 0.2)',
          'rgba(30, 192, 192, 0.2)',
          'rgba(34, 200, 255, 0.2)',
          'rgba(65, 159, 64, 0.2)'
      ],
      borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(30, 192, 192, 0.2)',
          'rgba(34, 200, 255, 0.2)',
          'rgba(65, 159, 64, 0.2)'
      ],
      borderWidth: 1
    }]
},
options: {
  legend: {
    display: false
  },
  scales: {
    yAxes: [{
      ticks: {
        suggestedMax: 500,
        min: 0,
        stepSize: 50
      }
    }]
  }
}
});

    }
  });

// Transactions

addTransactionToList.addEventListener("click", function() {

  // If any of the three input fields are empty
  if( !transactionCategory || !merchantName || !transDate || !transAmt ) {
    alert("Please ensure that you have selected a family, category and budgeted amount.");
  return};
  if(transactionCategory.value === "none" || !merchantName || !transDate || !transAmt ) {
    alert("Please ensure that you have selected a family, category and budgeted amount.");
    return};
  // If Amount input does not pass Regex test, show alert and stop running code below
  if(regex.test(transAmt.value) === false) {
    alert("Please enter a numeric value such as the following, in the Amount box: $100.50, $100, 100, etc.");
    return; } 
    // Otherwise, append Family, Category, and Amount to variable as an Object
    else {
      let transactionFamCatIndex = transactionCategory.selectedIndex;
      let transactionFamCat = transactionCategory.children[transactionFamCatIndex].className

      inputTransactionsAll = {
        catFamily: transactionFamCat,
        transCategory: transactionCategory.value,
        merchantName: inputToTitleCase(merchantName.value),
        transDate: transDate.value,
        transAmount: Math.round(parseFloat(transAmt.value))
      };
      // Push the object containing the input category into the Array that was created above
      transactionList.push(inputTransactionsAll);

      // Clear the input in each field
      clearInput([merchantName, transDate, transAmt]);
      clearSelectOption(transactionCategory);
      
      // Loop through transaction table to clear when the button is clicked before reprinting the updated array, while skipping the header row (that's why i starts at 1)
      for (let i = 1; i < transTableBody.childElementCount; i++) {
        clearElement(transTableBody.children[i])        
      }
      // For each object, show the input on the page through the showEntry function
      transactionList.forEach( (entry, index) => {
        showTransEntry(transTable, entry.catFamily, entry.transCategory, entry.merchantName, entry.transDate, entry.transAmount, index);
      });
      
      switch (inputTransactionsAll.catFamily) {
        case "Giving":
          givingTransAmt = calculateTotalTrans("Giving", transactionList); 
          givingDifference = (givingBudgetAmt - givingTransAmt);
          break;
        case "Housing":
          housingTransAmt = calculateTotalTrans("Housing", transactionList);
          housingDifference = (housingBudgetAmt - housingTransAmt);          
          break;  
        case "Transportation":
          transportationTransAmt = calculateTotalTrans("Transportation", transactionList);  
          transportationDifference = (transportationBudgetAmt - transportationTransAmt);        
          break;
        case "Food":
          foodTransAmt = calculateTotalTrans("Food", transactionList);   
          foodDifference = (foodBudgetAmt - foodTransAmt);       
          break;   
        case "Personal":
          personalTransAmt = calculateTotalTrans("Personal", transactionList);
          personalDifference = (personalBudgetAmt - personalTransAmt);   
          break; 
        case "Lifestyle":
          lifestylelTransAmt = calculateTotalTrans("Lifestyle", transactionList);
          lifestyleDifference = (lifestyleBudgetAmt - lifestyleTransAmt);
          break;  
        case "Health":
          healthTransAmt = calculateTotalTrans("Health", transactionList);
          healthDifference = (healthBudgetAmt - healthTransAmt);         
          break;
        case "Debt":
          debtTransAmt = calculateTotalTrans("Debt", transactionList);  
          debtDifference = (debtBudgetAmt - debtTransAmt);       
          break;
        case "Bills":
          billsTransAmt = calculateTotalTrans("Bills", transactionList);
          billsDifference = (billsBudgetAmt - billsTransAmt);          
          break;  
      }

      totalTransAmt = givingTransAmt + housingTransAmt + transportationTransAmt + foodTransAmt + personalTransAmt + lifestyleTransAmt + healthTransAmt + debtTransAmt + billsTransAmt;

      totalDifference = givingDifference + housingDifference + transportationDifference + foodDifference + personalDifference + lifestyleDifference + healthDifference + debtDifference + billsDifference;
      
      clearElement(totalBudgetedNum);
      updateBudgetNumbersPrintOut()

      new Chart(budgetedChart, {    
        type: "bar",
        // labels: ["Giving", "Housing", "Transportation", "Food", "Personal", "Lifestyle", "Health", "Debt", "Bills"],
        data: {
          labels: ["Giving", "Housing", "Transportation", "Food", "Personal", "Lifestyle", "Health", "Debt", "Bills"],
          datasets: [{
              label: 'Total Budgeted Amount',
              data: [givingBudgetAmt, housingBudgetAmt, transportationBudgetAmt, foodBudgetAmt, personalBudgetAmt, lifestyleBudgetAmt, healthBudgetAmt, debtBudgetAmt, billsBudgetAmt],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(295, 100, 64, 0.2)',
                  'rgba(30, 192, 192, 0.2)',
                  'rgba(34, 200, 255, 0.2)',
                  'rgba(65, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(30, 192, 192, 0.2)',
                  'rgba(34, 200, 255, 0.2)',
                  'rgba(65, 159, 64, 0.2)'
              ],
              borderWidth: 1
          }, {
            // labels: ["Giving Transactions", "Housing Transactions", "Transportation Transactions", "Food Transactions", "Personal Transactions", "Lifestyle Transactions", "Health Transactions", "Debt Transactions", "Bills Transactions"],              
            data: [givingTransAmt, housingTransAmt, transportationTransAmt, foodTransAmt, personalTransAmt, lifestyleTransAmt, healthTransAmt, debtTransAmt, billsTransAmt],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(295, 100, 64, 0.2)',
                'rgba(30, 192, 192, 0.2)',
                'rgba(34, 200, 255, 0.2)',
                'rgba(65, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(30, 192, 192, 0.2)',
                'rgba(34, 200, 255, 0.2)',
                'rgba(65, 159, 64, 0.2)'
            ],
            borderWidth: 1
          }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              suggestedMax: 500,
              min: 0,
              stepSize: 50
            }
          }]
        }
      }
      });

    }
});

// Biggest thing is to add the CSV reading abilities
csvFileUpload.addEventListener("change", function() {
  const reader = new FileReader();
  // Create arrays from each row
  reader.onload = function () {
    const lines = reader.result.split("\n").map(function (line) {
      return line.split(",")
    });
    // Skip the header row from the CSV
    rowContentFromCSV = lines.slice(1);
    // Reverse array so the index that prints on the page matches the array index
    rowContentFromCSV.reverse();
    tableFromCSV = document.querySelector("#tableFromCSV");
    tableBodyFromCSV = tableFromCSV.firstElementChild;

    // Append each row array to an object, then push each object into an array and print each of the objects in the array onto the page
    for (i = 0; i < rowContentFromCSV.length; i++) {
      transListFromCSV = {}; 
        transListFromCSV.catFamily = "";
        transListFromCSV.transCategory = "";
        transListFromCSV.merchantName = inputToTitleCase(rowContentFromCSV[i][1]);
        transListFromCSV.transDate = rowContentFromCSV[i][2];
        transListFromCSV.transAmount = Math.round(parseFloat(rowContentFromCSV[i][3]));
        transArrFromCSV.push(transListFromCSV)
      showTransEntryCSV(tableBodyFromCSV, transListFromCSV.transCategory, transListFromCSV.merchantName, transListFromCSV.transDate, transListFromCSV.transAmount, i);
    }

    transCatCell = document.querySelectorAll(".transCatCell");

    select = document.createElement("select");
    fragment = document.createDocumentFragment();

    budgetCategoryList.forEach((category) => {
      option = document.createElement("option");
      option.textContent = category.category;
      option.value = category.category;
      option.className = category.family;
      fragment.appendChild(option);
    });

    select.appendChild(fragment);
    select.className = "transListSelectedOption";

    approveBtn = document.createElement("button");
    approveBtn.textContent = "Approve";
    approveBtn.className = "approveBtns";

    transCatCell.forEach((category) => {
      category.appendChild(select.cloneNode(true));
      category.parentNode.appendChild(approveBtn.cloneNode(true));
    });
    transListSelectedOption = document.querySelectorAll(".transListSelectedOption");
    approveBtnsInDOM = document.querySelectorAll(".approveBtns");
    transactionRow = document.querySelectorAll(".transactionRow");

    for (let i = 0; i < transArrFromCSV.length; i++) {
      approveBtnsInDOM[i].addEventListener("click", function() {
        transArrFromCSV[i].transCategory = transListSelectedOption[i].value;
        let transactionFamCatIndex = transListSelectedOption[i].selectedIndex;
        let transactionFamCat = transListSelectedOption[i].children[transactionFamCatIndex].className;
        transArrFromCSV[i].catFamily = transactionFamCat;
        transactionList.push(transArrFromCSV[i]);
        clearElement(transCatCell[i].parentNode);
        for (let j = 0; j < transactionRow.length; j++) {
          transactionRow[j].innerHTML = ""
        }
        for (let j = 1; j < transTableBody.childElementCount; j++) {
          clearElement(transTableBody.children[j])        
        }
        transactionList.forEach( (entry, index) => {
        showTransEntry(transTable, entry.catFamily, entry.transCategory, entry.merchantName, entry.transDate, entry.transAmount, index);
        });
        switch (transactionList[i].catFamily) {
          case "Giving":
            givingTransAmt = calculateTotalTrans("Giving", transactionList); 
            givingDifference = (givingBudgetAmt - givingTransAmt);
            break;
          case "Housing":
            housingTransAmt = calculateTotalTrans("Housing", transactionList);
            housingDifference = (housingBudgetAmt - housingTransAmt);          
            break;  
          case "Transportation":
            transportationTransAmt = calculateTotalTrans("Transportation", transactionList);  
            transportationDifference = (transportationBudgetAmt - transportationTransAmt);        
            break;
          case "Food":
            foodTransAmt = calculateTotalTrans("Food", transactionList);   
            foodDifference = (foodBudgetAmt - foodTransAmt);       
            break;   
          case "Personal":
            personalTransAmt = calculateTotalTrans("Personal", transactionList);
            personalDifference = (personalBudgetAmt - personalTransAmt);   
            break; 
          case "Lifestyle":
            lifestylelTransAmt = calculateTotalTrans("Lifestyle", transactionList);
            lifestyleDifference = (lifestyleBudgetAmt - lifestyleTransAmt);
            break;  
          case "Health":
            healthTransAmt = calculateTotalTrans("Health", transactionList);
            healthDifference = (healthBudgetAmt - healthTransAmt);          
            break;
          case "Debt":
            debtTransAmt = calculateTotalTrans("Debt", transactionList);  
            debtDifference = (debtBudgetAmt - debtTransAmt);        
            break;
          case "Bills":
            billsTransAmt = calculateTotalTrans("Bills", transactionList);
            billsDifference = (billsBudgetAmt - billsTransAmt);          
            break;  
        };
        totalTransAmt = givingTransAmt + housingTransAmt + transportationTransAmt + foodTransAmt + personalTransAmt + lifestyleTransAmt + healthTransAmt + debtTransAmt + billsTransAmt;

        totalDifference = givingDifference + housingDifference + transportationDifference + foodDifference + personalDifference + lifestyleDifference + healthDifference + debtDifference + billsDifference;

        clearElement(totalBudgetedNum);
        updateBudgetNumbersPrintOut()


        new Chart(budgetedChart, {    
          type: "bar",
          // labels: ["Giving", "Housing", "Transportation", "Food", "Personal", "Lifestyle", "Health", "Debt", "Bills"],
          data: {
            labels: ["Giving", "Housing", "Transportation", "Food", "Personal", "Lifestyle", "Health", "Debt", "Bills"],
            datasets: [{
                label: 'Total Budgeted Amount',
                data: [givingBudgetAmt, housingBudgetAmt, transportationBudgetAmt, foodBudgetAmt, personalBudgetAmt, lifestyleBudgetAmt, healthBudgetAmt, debtBudgetAmt, billsBudgetAmt],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(295, 100, 64, 0.2)',
                    'rgba(30, 192, 192, 0.2)',
                    'rgba(34, 200, 255, 0.2)',
                    'rgba(65, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(30, 192, 192, 0.2)',
                    'rgba(34, 200, 255, 0.2)',
                    'rgba(65, 159, 64, 0.2)'
                ],
                borderWidth: 1
            }, {
              // labels: ["Giving Transactions", "Housing Transactions", "Transportation Transactions", "Food Transactions", "Personal Transactions", "Lifestyle Transactions", "Health Transactions", "Debt Transactions", "Bills Transactions"],              
              data: [givingTransAmt, housingTransAmt, transportationTransAmt, foodTransAmt, personalTransAmt, lifestyleTransAmt, healthTransAmt, debtTransAmt, billsTransAmt],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(295, 100, 64, 0.2)',
                  'rgba(30, 192, 192, 0.2)',
                  'rgba(34, 200, 255, 0.2)',
                  'rgba(65, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(30, 192, 192, 0.2)',
                  'rgba(34, 200, 255, 0.2)',
                  'rgba(65, 159, 64, 0.2)'
              ],
              borderWidth: 1
            }]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              ticks: {
                suggestedMax: 500,
                min: 0,
                stepSize: 50
              }
            }]
          }
        }
        });
        
      })
      
    };
    };

    
  reader.readAsText(csvFileUpload.files[0]);
}, false);



