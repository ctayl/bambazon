DROP DATABASE if exists bambazon;

CREATE DATABASE bambazon;

USE bambazon;

DROP TABLE IF exists products;

CREATE TABLE products (
item_id INTEGER AUTO_INCREMENT PRIMARY KEY,
product_name VARCHAR(30) NOT NULL,
department_name VARCHAR(30) NOT NULL,
price decimal (10, 2) NOT NULL,
stock_quantity INT NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("apple", "produce", 0.79, 14);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("banana", "produce", 0.49, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("kiwi", "produce", .50, 17);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("water bottle", "general merchandise", .79, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("apple juice", "general merchandise", .99, 10);

SELECT * FROM products;
