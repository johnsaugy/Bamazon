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
  console.log('\nBamazon Manager Menu'); //
  console.log('------------------------')
  console.log('Select a numeric option.')
  console.log('1. View Products for Sale');
  console.log('2. View Low Inventory');
  console.log('3. Add to Inventory');
  console.log('4. Add New Product');

  prompt.get(['menuSelection'], function (err, result) {
    
    // Switch case
    var menuSelection = parseInt(result.menuSelection);

    switch(menuSelection) {
      case 1:
          console.log('\n You chose: "View Products for Sale"');
          viewProducts(function(){});
          connection.end();
          break;
      
      case 2:
          console.log('\n You chose: "View Low Inventory"');
          viewLowInventory();
          connection.end();
          break;
      
      case 3:
        console.log('\n You chose "Add to Inventory" ');
        addInventory();
        break;

      case 4:
        console.log('\n You chose "Add New Product"');
        addNewProduct();
        break;

      default:
        console.log('Not a vaild entry. Try again.');
        connection.end(); 

    }   
  }); 
}); 

// ---------------------------------------------------------------------------------
// 1. View products for sale
function viewProducts(callback){

  // Display all items inside database
  connection.query('SELECT * FROM Products', function(err, res){
    // Error Handler
    if(err) throw err;

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

    console.log(itemID + '|' + productName + '|' + departmentName + '|' + price + '|    ' + quantity);
  }

  // =================================================================================================

    // Callback function
    callback();
  });
}
// ---------------------------------------------------------------------------------

// 2. View Low Inventory
function viewLowInventory(){
   // Display all items inside database <10 in stock
  connection.query('SELECT * FROM Products WHERE StockQuantity < 10', function(err, res){
  
    // Error Handler
    if(err) throw err;

    // Log user message
    console.log('Inventory for Items < 10 In Stock is below...\n');

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

    console.log(itemID + '|' + productName + '|' + departmentName + '|' + price + '|    ' + quantity);
  }

  // =================================================================================================


    console.log('\nBetter restock fast!')
  });
}
// ---------------------------------------------------------------------------------

// 3. Add to Inventory
function addInventory(){
  
  // Run the View Products Function from case 1, then ask user for input after callback
  viewProducts(function(){

    // Prompt user for re-stock item
    prompt.start();
    console.log('\nWhich item would you like to restock?');
    prompt.get(['restockItemID'], function (err, result) {
      
      // Show Item ID selected
      var restockItemID = result.restockItemID;
      console.log('You selected to restock Item # ' + restockItemID + '.');

      // Prompt for how many more items
      console.log('\nHow many items will you restock?');
      prompt.get(['restockCount'], function(err, result){
        
        //Show Restock Count selected
        var restockCount = result.restockCount;
        console.log('You selected to restock ' + restockCount + ' items.');
        restockCount = parseInt(restockCount); // convert to integer

        if(Number.isInteger(restockCount)){

          // Query for current item inventory
          connection.query('SELECT StockQuantity FROM Products WHERE ?', [{ItemID: restockItemID}], function(err, res){

            // Check if item ID is valid
            if(res[0] == undefined){
              
              console.log('Sorry, we did not find any items ID # "' +  restockItemID + '"');
              connection.end();

            }
            // Valid Item ID, so add Bamazon Inventory
            else{
              
              var bamazonQuantity = res[0].StockQuantity;
              var newInventory = parseInt(bamazonQuantity) + parseInt(restockCount); // ensure integers

              // Update Database
              connection.query('UPDATE Products SET ? WHERE ?', [{StockQuantity: newInventory}, {ItemID: restockItemID}], function(err, res){
                if(err) throw err;

                console.log('\nInventory updated successfully!')
                connection.end();
              }); 
            }
          });
        }
        else{
          console.log('Try entering a whole number.')
          connection.end();
        }
      }); 
    }); 
  }); 
}
// ---------------------------------------------------------------------------------

// 4. Add New Product
function addNewProduct(){

  // Prompt user for new product details
  prompt.start();
  console.log('\nComplete the new product details:');
  prompt.get(['ProductName', 'DepartmentName', 'Price', 'Quantity'], function (err, result) {

    var productName = result.ProductName;
    var departmentName = result.DepartmentName;
    var price = result.Price;
    var quantity = result.Quantity;

    // Update Database
    connection.query('INSERT INTO Products SET ?', {
      ProductName: productName,
      DepartmentName: departmentName,
      Price: price,
      StockQuantity: quantity
    }, function(err, res){

    
      if(err){
        console.log('\nSorry. The SQL database could not be updated.\n');
        connection.end();
      }
      else{
        console.log('\nInventory has been successfully updated.')
        connection.end();
      }
    });
  });
}

