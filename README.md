# JavaScript Budgeter

JavaScript Budgeter is my project application for my JavaScript course with Code Louisvile in the Spring 2021 semester.

Budgeting is something that most adults do and each person has to find a system that works for them. The app that my wife and I use for our budget requires a premium membership to be able to either sync your bank account or upload CSV files to it. My frugality and desire to be able to produce an application that can handle CSV files was the inspiration for this project. This idea then gave me a platform to develop and test my JavaScript knowledge from the class so far.

JavaScript Budgeter allows the user to create their own budget categories and amounts, then input transactions, and upload CSV files containing transactions to have categories assigned to. As the budgets are set and transactions are assigned, the chart and the table will adjust to reflect the comparison between what has been planned and spent in each "family" of category.

**Because the application only contains front-end code, user input does not persist after page refreshing.**


## Instructions:

* **In the command line, run `npm install` to install the packages used in this project.** The packages are used by linking to the local file in the node_modules folder, rather than through Node.js.

* **Create your budget categories first.** To do this, scroll down to "Create Your Own Budget Categories". The first step is to select a "Family" to assign the category you are about to create. Next, type the name of your budget category and assign an amount to the category. Click "Add Category". This will assign the input to an object (`budgetCategoriesAll`) and push the object into an array (`budgetCategoryList`). Clicking the button should update the "Planned" and "Left Over" cells in the table row for the Family corresponding to the Family that you selected, as well as the "Total" table row at the bottom. The chart should update simultaneously. The suggested maximum value on the chart is $500, but the chart should adjust if the budget number is higher than $500. **Note: You must create all of the budget categories that you would like to use for your budget before moving on to later steps.**

* **Manually create your transactions using the input fields.** In the `<select>`, you will be able to choose from the categories that you just created. Once you select a category, enter the Merchant, Date, and Amount for your transaction and click "Add to Category." This should add the input into an object (`inputTransactionsAll`) and push the object into an array (`transactionList`). On the page, clicking the button should update the "Spent" and "Difference" cells in the table row for the family that the category of the transaction belongs to, update the chart, and add the transaction to a transaction table below the transaction input.

* **Upload your CSV to the page.** I have provided "testCSVforProject.csv" in the repo for testing purposes. You would also be able to upload other files, but they would need to include a header (to be removed in the code) and four columns in the same order. This design is modified from what I have seen between my bank and credit card company. To upload a CSV click the "Upload CSV Here" button and select the file to upload. Each row (skipping the header) is added to an object (`transListFromCsv`) and then passed into an array (`transArrFromCSV`). This array is then displayed in the "Pending Transactions from CSV Upload" table. Each row has an "Approve" button on the right side. As long as the pending transaction has a `select` category assigned to it, the transaction will be pushed to `transactionList` (and added to the transaction table), removed from `transArrFromCSV` (and removed from the pending transactions table), update the "Spent" and "Left Over" cells in the budget table, and update the chart. 


### JavaScript Budgeter has a responsive design through the use of two media queries (768px, 992px) and FlexBox.

* At the first media query, I make the following changes:

    * The calculated table gets limited from `width: 100%` to `width: 94%` and is centered with `margin: auto`.
    * The `<div>` that the `<canvas>` is in changes from `display: none` to `display: block`, is limited to `width: 45%`, and is centered with `margin: auto`.

* At the second media query, I make the following changes:

    * `#inputDivs` is given a style of `display: flex` and `justify-content: space-around` to allow the children to display beside each other.
    * `#createCategory` and `#transactionDiv` are limited to `width: 48%` to give some extra whitespace around their content.

## Features:

* **Read and parse an external file (such as JSON or CSV) into your application and display some data from that in your app.**

    * This is done with the native FileReader API. The read file is then split on each new line, each row is passed into an array and the items are split by commas. I then skip the first row (header row), reverse the array (to help later with the index of the array items matching with the index of the rows in the pending transactions table). The result is to have a reversed array of arrays (`rowContentFromCSV`), minus the header row. After this, each row array passes through a for loop that assigns values to some of the keys in the `transListFromCSV` object, while leaving some keys values as empty strings to be filled later. The for loop then pushes each `transListFromCSV` object into the `transArrFromCSV` array and displays the value of `transListFromCSV` in the pending transactions table.

* **Create an array, dictionary or list, populate it with multiple values, retrieve at least one value, and use or display it in your application.**

    * This is done in numerous locations. Each of the tables, the chart, and the `<select>` elements do this.

* **Create and use a function that accepts two or more values (parameters), calculates or determines a new value based on those inputs, and returns a new value.**

    * I included two functions that accept more than two parameters and returns a new value. I'm not sure if this is what is intended by this requirement, but `showTransEntry` accepts 7 parameters (an element and 6 object values to display on the page in a template literal). `showTransEntryCSV` is a similar function, but takes an element and 5 object values.

* **Implement a regular expression (regex) to ensure a field either a phone number or an email address is always stored and displayed in the same format.**

    * I don't use regex for a phone number or email, but I use it to vaildate number inputs. I declare a variable containing `/^\$?\d+(,\d{3})*\.?[0-9]?[0-9]?$/` and use the `test()` method to ensure that the number input in the "Amount" fields only contain "$", digits, and ".". If the value is not matching, then I throw an alert asking for a specific format in the input.

    * I also use regex in my `toTitleCase()` function. This function takes text input and converts it to lowercase with `toLowerCase()`, finds the first letter of each word with `/(?:^|\s|-|_)\w/g`, and then converts it to uppercase with `toUpperCase()` using the `replace()` method.

* **Calculate and display data based on an external factor (ex: get the current date, and display how many days remaining until some event).**

    * I grab the current date for my date picker. I assign `new Date()` to a variable and then use `.toLocaleDateString()` for the current date and then assign that as the `maxDate` in the date picker, since its impossible to be logging transactions that have not happened yet. I also used the date variable and subtracted 90 days using `.setDate(currentDate.getDate()-90)` for the `minDate` for the picker.

* **Visualize data in a graph, chart, or other visual representation of data.**

    * I do this with the graph that I use from Chart.js. I display the budgeted amounts per category and the transactions amount per category in the bar graph on the page (with viewports larger than 768px).