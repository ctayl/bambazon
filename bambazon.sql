CREATE DATABASE bambazon;

USE bambazon;

DROP TABLE products;

CREATE TABLE products (
item_id INTEGER AUTO_INCREMENT PRIMARY KEY,
product_name VARCHAR(30) NOT NULL,
department_name VARCHAR(30) NOT NULL,
price INT NOT NULL,
stock_quantity INT NOT NULL
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("test", "testing", 100, 10);

SELECT * FROM products WHERE item_id = 1;

UPDATE products
SET stock_quantity = stock_quantity - 1
WHERE item_id = 1;