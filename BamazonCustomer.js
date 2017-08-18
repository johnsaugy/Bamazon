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
});

// Display all items inside database
connection.query('SELECT * FROM Products', function(err, res){
  
  // Error Handler
  if(err) throw err;

  console.log('Please take a look at our latest selection...\n');

  // Table header
  console.log('  ID  |      Product Name      |  Department Name  |   Price  | In Stock');
  console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ')
  
  // Loop through database and show all items
  for(var i = 0; i < res.length; i++){

    //=============================== Add table padding ====================================
    var itemID = res[i].ItemID + '';
    itemID = padText("  ID  ", itemID);

    var productName = res[i].ProductName + '';
    productName = padText("      Product Name      ", productName);

    var departmentName = res[i].DepartmentName + ''; 
    departmentName = padText("  Department Name  ", departmentName);

    var price = '$' + res[i].Price.toFixed(2) + '';
    price = padText("   Price  ", price);

    var quantity = res[i].StockQuantity + '';
    // ----------------------------------------------

    // Log table entry
    console.log(itemID + '|' + productName + '|' + departmentName + '|' + price + '|    ' + quantity);
  }

  // =================================================================================================

  // After table is shown, asks user what they want to buy
  prompt.start();

  // Asks for item ID
  console.log('\nWhich item do you wish to buy?');
  prompt.get(['buyItemID'], function (err, result) {
    
    // Shows Item ID selected
    var buyItemID = result.buyItemID;
    console.log('Item # ' + buyItemID + ' added to cart.');

    // How much of that item ID does user wish to buy?
    console.log('\nHow many do you wish to buy?')
    prompt.get(['buyItemQuantity'], function (err, result) {

      // Show quantity selected
      var buyItemQuantity = result.buyItemQuantity;
      console.log('You successfully purchased '+ buyItemQuantity + ' of these.');

      // Does store supply meet customer demand?
      connection.query('SELECT StockQuantity FROM Products WHERE ?', [{ItemID: buyItemID}], function(err, res){
        if(err) throw err; // Error Handler
        
        // Is item ID valid?
        if(res[0] == undefined){
          console.log('Sorry, we did not find an item with ID "' +  buyItemID + '"');
          connection.end(); // end script
        }
        // It's a valid Item ID, so compare Bamazon supply with user demand
        else{
          var bamazonQuantity = res[0].StockQuantity;
          
          // There's enough inventory...
          if(bamazonQuantity >= buyItemQuantity){

            // Update mySQL database with --inventory
            var newInventory = parseInt(bamazonQuantity) - parseInt(buyItemQuantity); // Parse to make sure we have integers to subtract in database
            connection.query('UPDATE Products SET ? WHERE ?', [{StockQuantity: newInventory}, {ItemID: buyItemID}], function(err, res){
              if(err) throw err; // Error Handler
            }); 

            // Show customer their checkout total
            var customerTotal;
            connection.query('SELECT Price FROM Products WHERE ?', [{ItemID: buyItemID}], function(err, res){
              
              var buyItemPrice = res[0].Price;
              customerTotal = buyItemQuantity*buyItemPrice.toFixed(2);

              console.log('\nYour total is $' + customerTotal + '.');

              // ------------------------- For Supervisor ------------------------
              // Find the department for the purchase item
              connection.query('SELECT DepartmentName FROM Products WHERE ?', [{ItemID: buyItemID}], function(err, res){
                var itemDepartment = res[0].DepartmentName;
                
                // Find current Revenue for that department
                connection.query('SELECT TotalSales FROM Departments WHERE ?', [{DepartmentName: itemDepartment}], function(err, res){
                  var totalSales = res[0].TotalSales;

                  // Calculate new sale revenue
                  var totalSales = parseFloat(totalSales) + parseFloat(customerTotal);

                  // Add revenue from each transaction to that department's total sales
                  connection.query('UPDATE Departments SET ? WHERE ?', [{TotalSales: totalSales}, {DepartmentName: itemDepartment}], function(err, res){
                    if(err) throw err; 
                    console.log('Transaction Complete. Thank you for shopping at Bamazon!')
                    connection.end(); 
                  }); 
                }); 
              }); 
              // -------------------------------------------------------------------------------------
            }); 
          }

          // Insufficient inventory
          else{
            console.log('Sorry, we only have ' +  bamazonQuantity + ' of those items in stock. Order cancelled.');
            
            connection.end();
          }
        }
      });
    });
  });
});