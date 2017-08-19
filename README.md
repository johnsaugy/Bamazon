# Bamazon

An experimental CLI ecommerce application built with Node.js & MySQL. This application implements a simple command line based storefront using the npm [inquirer](https://www.npmjs.com/package/inquirer) package and the MySQL database backend together with the npm [mysql](https://www.npmjs.com/package/mysql) package. The application presents three different interfaces: **customer**, **manager**, and **supervisor**.

## Getting Started
### MySQL

In order to run this application, you should have the MySQL database already set up. If you do not, visit the [MySQL installation page](https://dev.mysql.com/doc/refman/5.6/en/installing.html) to install the version you need for your operating system. Once you have MySQL installed, you will be able to create the *Bamazon* database and the *Products* and *Departments* table with the SQL code found in [Bamazon.sql](Bamazon.sql). Run this code inside your MySQL client, for example, [Sequel Pro](https://www.sequelpro.com/), to populate the database. Then, you will be ready to proceed with running the Bamazon customer manager, and supervisor interfaces!

### Node Package Manager (npm)
Before running the JavaScript files mentioned above, please run `npm install` in your terminal to download the [prompt](https://www.npmjs.com/package/prompt) and [mysql](https://www.npmjs.com/package/mysql) node packages.

### Javascript Files
Three JavaScript files replicate the basic interfaces of the application:

- `BamazonCustomer.js` _([See example here](#customer))_
  - Receives orders from customers via the command line and interfaces with mySQL to deplete stock from the store's inventory.

- `BamazonManager.js` _([See example here](#manager))_
  - Mimics the basics of a warehouse management system, providing managers with a list of options to view current inventory and restock as needed.
  - A sample of the menu is below:
    * View Products for Sale 
    * View Low Inventory
    * Add to Inventory
    * Add New Product

- `BamazonSupervisor.js` _([See example here](#supervisor))_
  - Simulates very basic profit and sales insights for upper management.
  - A sample of the menu is below:
    * View Product Sales by Department 
    * Create New Department

## Demo

Below are some screenshots that demo the functionality of the application:

<a name="customer"></a>
- Below is a demo of the `BamazonCustomer.js` file...
  - Running `node BamazonCustomer.js` will use MySQL to pull up all the products for sale.
    - The customer can then choose a product using its ID and then enter a quantity to buy.
      ![Customer Order](/images/1.png)
    - If the inventory has enough items, the order will be processed.
      ![Order Valid](/images/2.png)
    - If the inventory is lacking, the order will not be processed.
      ![Order Invalid](/images/3.png)


<a name="manager"></a>
- Below is a demo of the `BamazonManager.js` file...
  - Running `node BamazonManager.js` will display a menu and perform the specific requests.
    ![Manager Menu](/images/4.png)
    - The manager can choose option `1` to view the current inventory.
      ![Manager 1](/images/5.png)
    - The manager can choose option `2` to see low items in inventory (less than 10 in stock).
      ![Manager 2](/images/6.png)
    - The manager can choose option `3` to re-stock existing items.
      ![Manager 3](/images/7.png)
    - The manager can choose option `4` to add new items for sale.
      ![Manager 4](/images/8.png)
      - Notice how the inventory was adjusted from steps `3` and `4`.
        ![Manager 4b](/images/9.png)


<a name="supervisor"></a>
- Below is a demo of the `Bamazon.js` file...
  - Running `node BamazonSupervisor.js` will display a menu and perform the specific requests.
    ![Supervisor Menu](/images/10.png)
    - The Supervisor can choose option `1` to view the sales by department.
      ![Supervisor 1](/images/11.png)
    - The Supervisor can choose option `2` to add a new department.
      ![Supervisor 2](/images/12.png)
      - Notice how the department list was adjusted from step `2`.
        ![Supvervisor 2a](/images/13.png)
      - Also note that the manager can add a new item to the department and if a customer buys said item, it will cause total sales and profit to increase in that department.
