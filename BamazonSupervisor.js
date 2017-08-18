var prompt = require('prompt');
var mysql = require('mysql');
var padText = require('./padTable.js')

// Link to mySQL Database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "", 
    database: "Bamazon"
});

// Connect to database
connection.connect(function(err) {
    if (err) throw err;
    console.log("You are connected as ID #" + connection.threadId);

  // Prompt user with options
  prompt.start();

  // Display Menu
  console.log('\nBamazon Supervisor Menu');
  console.log('-------------------------')
  console.log('Select a numeric option.')
  console.log('1. View Product Sales by Department');
  console.log('2. Create New Department');

  prompt.get(['menuSelection'], function (err, result) {
    
    // Switch Case 
    var menuSelection = parseInt(result.menuSelection);

    switch(menuSelection) {
      case 1:
        console.log('\n You chose "View Product Sales by Department"');
        viewSalesByDept();
        break;

      case 2:
        console.log('\n You chose: "Create New Department"');
        addNewDept();
        break;

      default:
        console.log('Not a vaild entry. Aborting.');
        connection.end();
    }
  });
});
    
// 1. View Product Sales by Department
function viewSalesByDept(){

  connection.query('SELECT * FROM Departments', function(err, res){
    if(err) throw err;

    // Table header
    console.log('\n' + '  ID  |  Department Name  |  OverHead Costs |  Product Sales  |  Total Profit');
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
    
    // Loop through database and show all items
    for(var i = 0; i < res.length; i++){

 //=============================== Add table padding ====================================
      var departmentID = res[i].DepartmentID + ''; // convert to string
      departmentID = padText("  ID  ", departmentID);

      var departmentName = res[i].DepartmentName + ''; // convert to string
      departmentName = padText("  Department Name  ", departmentName);

      // Profit calculation
      var overHeadCost = res[i].OverHeadCosts.toFixed(2);
      var totalSales = res[i].TotalSales.toFixed(2);
      var totalProfit = (parseFloat(totalSales) - parseFloat(overHeadCost)).toFixed(2);


      // Add $ signs to values
      overHeadCost = '$' + overHeadCost;
      totalSales = '$' + totalSales;
      totalProfit = '$' + totalProfit;

      // Padding for table
      overHeadCost = padText("  OverHead Costs ", overHeadCost);
      totalSales = padText("  Product Sales  ", totalSales);
      
 // =================================================================================================

      console.log(departmentID + '|' + departmentName + '|' + overHeadCost + '|' + totalSales + '|  ' + totalProfit);
    }
    connection.end();
  });
}

// ---------------------------------------------------------------------------------

// 2. Create New Department
function addNewDept(){

  // Prompt user for new item details
  prompt.start();
  console.log('\nComplete the new department details:');
  prompt.get(['DepartmentName', 'OverHeadCosts', 'TotalSales'], function (err, result) {

    var departmentName = result.DepartmentName;
    var overHeadCost = result.OverHeadCosts;
    var totalSales = result.TotalSales;

    // Update Database
    connection.query('INSERT INTO Departments SET ?', {
      DepartmentName: departmentName,
      OverHeadCosts: overHeadCost,
      TotalSales: totalSales
    }, function(err, res){
  
      if(err){
        console.log('\nSorry. The SQL database could not be updated.\n');
        connection.end();
      }
      else{
        console.log('\nNew department has been sucessfully updated.');
        connection.end();
      }
    });
  });
}