# JavaScript Budgeter

JavaScript Budgeter is my project application for my JavaScript course with Code Louisvile in the Spring 2021 semester.

Budgeting is something that most adults do and each person has to find a system that works for them. The app that my wife and I use for our budget requires a premium membership to be able to either sync your bank account or upload CSV files to it. My frugality and desire to be able to produce an application that can handle CSV files was the inspiration for this project. This idea then gave me a platform to develop and test my JavaScript knowledge from the class so far.

JavaScript Budgeter allows the user to create their own budget categories and amounts, then input transactions, and upload CSV files containing transactions to have categories assigned to. As the budgets are set and transactions are assigned, the chart and the table will adjust to reflect the comparison between what has been planned and spent in each "family" of category.

Because the application only contains front-end code, user input does not persist after page refreshing. 

Here are the instructions for using the application:
* In the command line, run `npm install` to install the packages used in this project. The packages are used by linking to the local file in the node_modules folder, rather than through Node.js.
* Create your budget categories first. To do this, scroll down to "Create Your Own Budget Categories". The first step is to select a "Family" to assign the category you are about to create. Next, type the name of your budget category and assign an amount to the category. Click "Add Category". This will assign the input to an object (`budgetCategoriesAll`) and push the object into an array (`budgetCategoryList`). Clicking the button should update the "Planned" and "Left Over" cells in the table row for the Family corresponding to the Family that you selected, as well as the "Total" table row at the bottom. The chart should update simultaneously. The suggested maximum value on the chart is $500, but the chart should adjust if the budget number is higher than $500. Note: Create all of the budget categories that you would like to use for your budget before moving on to later steps.
* Manually create your transactions using the input fields. In the `<select>`, you will be able to choose from the categories that you just created. Once you select a category, enter the Merchant, Date, and Amount for your transaction and click "Add to Category." This should add the input into an object (`inputTransactionsAll`) and push the object into an array (`transactionList`). On the page, clicking the button should update the "Spent" and "Difference" cells in the table row for the family that the category of the transaction belongs to, update the chart, and add the transaction to a transaction table below the transaction input.
* Upload your CSV to the page. I have provided `testCSVforProject.csv` in the repo for testing purposes. You would also be able to upload other files, but they would need to include a header (to be removed in the code) and four columns in the same order. This design is modified from what I have seen between my bank and credit card company. To upload a CSV click the "Upload CSV Here" button and select the file to upload. Each row (skipping the header) is added to an object (`transListFromCsv`) and then passed into an array (`transArrFromCSV`). This array is then displayed in the "Pending Transactions from CSV Upload" table. Each row has an "Approve" button on the right side. As long as the pending transaction has a `select` category assigned to it, the transaction will be pushed to `transactionList` (and added to the transaction table), removed from `transArrFromCSV` (and removed from the pending transactions table), update the "Spent" and "Left Over" cells in the budget table, and update the chart. 