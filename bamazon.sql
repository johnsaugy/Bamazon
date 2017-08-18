-- Database Creation
CREATE DATABASE Bamazon;

USE Bamazon;

-- ============================ First Table ============================

CREATE TABLE Products(
ItemID INTEGER AUTO_INCREMENT PRIMARY KEY,
ProductName VARCHAR(30),
DepartmentName VARCHAR(30),
Price DOUBLE(10,2),
StockQuantity INTEGER);

-- Seed Items into Database
INSERT INTO Products(Product_Name, Department_Name, Price, Stock_Quantity)
VALUES ("Eggs", "grocery", 2.91, 50),
  ("Milk", "grocery", 4.54, 50),
  ("PS4", "electronics", 299.99, 15),
  ("Nintendo Switch", "electronics", 389.99, 15),
  ("iPhone 7", "electronics", 649.99, 45),
  ("Frisbee", "sporting goods", 9.99, 100),
  ("Football", "sporting goods", 12.99, 200),
  ("Harry Potter", "books", 10.99, 45),
  ("Game of Thrones", "books", 19.99, 67),
  ("Lord of the Rings", "books", 12.43, 60),
  ("Interstellar", "dvds", 9.89, 9),  
  ("The Avengers", "dvds", 14.99, 2),
  ("Back In Black-AC/DC", "music", 20.00, 5);


-- ============================ Second Table ============================

CREATE TABLE Departments(
DepartmentID INTEGER AUTO_INCREMENT PRIMARY KEY,
DepartmentName VARCHAR(30),
OverHeadCosts DOUBLE(10,2),
TotalSales DOUBLE(10,2));

-- Seed Departments into Database
INSERT INTO Departments(Department_Name, Overhead_Costs, Total_Sales)
VALUES ("grocery", 5000.00, 14255.07),
  ("electronics", 10000.00, 33213.98),
  ("sporting goods", 3000.00, 2426.93),
  ("books", 5000.00, 2357.58),
  ("dvds", 4000.00, 3456.00),
  ("music", 7500.00, 4644.00);