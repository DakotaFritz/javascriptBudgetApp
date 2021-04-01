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
function showTransEntry(list, family, category, merchant, date, amount, id){

  const entry = 
    `<tr class="transactionRow" id="${id}">
      <td>${family}
      <td>${category}</td>
      <td>${merchant}</td>
      <td>${date}</td>
      <td>${convertToDollar(amount)}</td>
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
      <td>${convertToDollar(amount)}</td>
    </tr>`;

  const position = "beforeend";
  // The entry variable content will be placed "beforeend" (at the top of the list) of the HTML location passed into the function
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
    <div id="calculatedBudgetAmt">
      <div id="totalBudgetDiv">
        <img src="images/moneybags.png" alt="Moneybag" class="summaryImages">
        <p>Total Budget: ${convertToDollar(totalBudgetAmt)}</p>
      </div>
      <div id="categoryBudgetTotals">
        <p>Giving Budget: ${convertToDollar(givingBudgetAmt)}</p>
        <p>Housing Budget: ${convertToDollar(housingBudgetAmt)}</p>
        <p>Transportation Budget: ${convertToDollar(transportationBudgetAmt)}</p>
        <p>Food Budget: ${convertToDollar(foodBudgetAmt)}</p>
        <p>Personal Budget: ${convertToDollar(personalBudgetAmt)}</p>
        <p>Lifestyle Budget: ${convertToDollar(lifestyleBudgetAmt)}</p>
        <p>Health Budget: ${convertToDollar(healthBudgetAmt)}</p>
        <p>Debt Budget: ${convertToDollar(debtBudgetAmt)}</p>
        <p>Bills Budget: ${convertToDollar(billsBudgetAmt)}</p>
      </div>
    </div>

    <div id="calculatedTransAmt">
      <div id="totalTransDiv">
        <img src="images/receipt.png" alt="Moneybag" class="summaryImages">
        <p>Total Spent: ${convertToDollar(totalTransAmt)}</p>
      </div>
      <div id="categoryTransTotals">
        <p>Giving Spent: ${convertToDollar(givingTransAmt)}</p>
        <p>Housing Spent: ${convertToDollar(housingTransAmt)}</p>
        <p>Transportation Spent ${convertToDollar(transportationTransAmt)}</p>
        <p>Food Spent: ${convertToDollar(foodTransAmt)}</p>
        <p>Personal Spent ${convertToDollar(personalTransAmt)}</p>
        <p>Lifestyle Spent ${convertToDollar(lifestyleTransAmt)}</p>
        <p>Health Spent ${convertToDollar(healthTransAmt)}</p>
        <p>Debt Spent ${convertToDollar(debtTransAmt)}</p>
        <p>Bills Spent ${convertToDollar(billsTransAmt)}</p>
      </div>
    </div>

    <div id="calculatedDifference">
      <div id="totalDiffDiv">
        <img src="images/dividend.png" alt="Moneybag" class="summaryImages">
        <p>Total Difference ${convertToDollar(totalDifference)}</p>
      </div>
      <div id="categoryDiffTotals">
        <p>Giving Difference ${convertToDollar(givingDifference)}</p>
        <p>Housing Difference ${convertToDollar(housingDifference)}</p>
        <p>Transportation Difference ${convertToDollar(transportationDifference)}</p>
        <p>Food Difference ${convertToDollar(foodDifference)}</p>
        <p>Personal Difference ${convertToDollar(personalDifference)}</p>
        <p>Lifestyle Difference ${convertToDollar(lifestyleDifference)}</p>
        <p>Health Difference ${convertToDollar(healthDifference)}</p>
        <p>Debt Difference ${convertToDollar(debtDifference)}</p>
        <p>Bills Difference ${convertToDollar(billsDifference)}</p>
      </div>
    </div>
  </div>
  `);
};
// First call to put it on the page
updateBudgetNumbersPrintOut();


// Variables for the toggle - could be moved up in the script
let totalBudgetDiv = document.querySelector("#totalBudgetDiv");
let totalTransDiv = document.querySelector("#totalTransDiv");
let totalDiffDiv = document.querySelector("#totalDiffDiv")

// Function to perform a slideToggle for total budget numbers
let slideUp = (target, duration) => {
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = duration + 'ms';
  target.style.boxSizing = 'border-box';
  target.style.height = target.offsetHeight + 'px';

  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.style.overflow = 'hidden';

  window.setTimeout( () => {
    target.style.display = 'none';
    target.style.removeProperty('height');
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
}

let slideDown = (target, duration) => {
  target.style.removeProperty('display');
  let display = window.getComputedStyle(target).display;
  if (display === 'none') {
    display = 'block';
  }
  target.style.display = display;

  let height = target.offsetHeight;
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.style.overflow = 'hidden';

  target.style.boxSizing = 'border-box';
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + 'ms';
  target.style.height = height + 'px';
  target.style.removeProperty('padding-top');
  target.style.removeProperty('padding-bottom');
  target.style.removeProperty('margin-top');
  target.style.removeProperty('margin-bottom');

  window.setTimeout( () => {
    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
};

let slideToggle = (target, duration = 500) => {
  if (window.getComputedStyle(target).display === 'none') {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
};

totalBudgetDiv.addEventListener('click', function() {
  slideToggle(document.getElementById("categoryBudgetTotals"), 200);
});

totalTransDiv.addEventListener('click', function() {
  slideToggle(document.getElementById("categoryTransTotals"), 200);
});

totalDiffDiv.addEventListener('click', function() {
  slideToggle(document.getElementById("categoryDiffTotals"), 200);
});

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
      // Chart.plugins.register({
//   afterDraw: function(chart) {
//       if (chart.data.datasets[0].data.every(item => item === 0)) {
//           let ctx = chart.chart.ctx;
//           let width = chart.chart.width;
//           let height = chart.chart.height;

//           chart.clear();
//           ctx.save();
//           ctx.textAlign = 'center';
//           ctx.textBaseline = 'middle';
//           ctx.fillText('Budgeted Amounts Will Display Here', width / 2, height / 2);
//           ctx.restore();
//       }
//   }
// });

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
          givingDifference = givingBudgetAmt - givingTransAmt;
          break;
        case "Housing":
          housingTransAmt = calculateTotalTrans("Housing", transactionList);
          housingDifference = housingBudgetAmt - givingTransAmt;          
          break;  
        case "Transportation":
          transportationTransAmt = calculateTotalTrans("Transportation", transactionList);  
          transportationDifference = transportationBudgetAmt - transportationTransAmt;        
          break;
        case "Food":
          foodTransAmt = calculateTotalTrans("Food", transactionList);   
          foodDifference = foodBudgetAmt - foodTransAmt;       
          break;   
        case "Personal":
          personalTransAmt = calculateTotalTrans("Personal", transactionList);
          personalDifference = personalBudgetAmt - personalTransAmt;   
          break; 
        case "lifestyle":
          lifestylelTransAmt = calculateTotalTrans("Lifestyle", transactionList);
          lifestyleDifference = lifestyleBudgetAmt - lifestyleTransAmt;
          break;  
        case "Health":
          healthTransAmt = calculateTotalTrans("Health", transactionList);
          healthDifference = healthBudgetAmt - healthTransAmt          
          break;
        case "Debt":
          debtTransAmt = calculateTotalTrans("Debt", transactionList);  
          debtDifference = debtBudgetAmt - debtTransAmt        
          break;
        case "Bills":
          billsTransAmt = calculateTotalTrans("Bills", transactionList);
          billsDifference = billsBudgetAmt - billsTransAmt;          
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
            givingDifference = givingBudgetAmt - givingTransAmt;
            break;
          case "Housing":
            housingTransAmt = calculateTotalTrans("Housing", transactionList);
            housingDifference = housingBudgetAmt - givingTransAmt;          
            break;  
          case "Transportation":
            transportationTransAmt = calculateTotalTrans("Transportation", transactionList);  
            transportationDifference = transportationBudgetAmt - transportationTransAmt;        
            break;
          case "Food":
            foodTransAmt = calculateTotalTrans("Food", transactionList);   
            foodDifference = foodBudgetAmt - foodTransAmt;       
            break;   
          case "Personal":
            personalTransAmt = calculateTotalTrans("Personal", transactionList);
            personalDifference = personalBudgetAmt - personalTransAmt;   
            break; 
          case "lifestyle":
            lifestylelTransAmt = calculateTotalTrans("Lifestyle", transactionList);
            lifestyleDifference = lifestyleBudgetAmt - lifestyleTransAmt;
            break;  
          case "Health":
            healthTransAmt = calculateTotalTrans("Health", transactionList);
            healthDifference = healthBudgetAmt - healthTransAmt          
            break;
          case "Debt":
            debtTransAmt = calculateTotalTrans("Debt", transactionList);  
            debtDifference = debtBudgetAmt - debtTransAmt        
            break;
          case "Bills":
            billsTransAmt = calculateTotalTrans("Bills", transactionList);
            billsDifference = billsBudgetAmt - billsTransAmt;          
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



