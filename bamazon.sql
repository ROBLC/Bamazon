CREATE DATABASE bamazon;

use bamazon;

CREATE TABLE products(
	item_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(11,2) NOT NULL,
    stock_quantity INT(11),
    PRIMARY KEY (item_id)
);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES(1, "Cristal Necklace", Jewelry, 100,25);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES(2, "Black Pen", "Office stationary", 1,150);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES(3, "Red Dead Redemption II", Videogames, 60,15);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES(4, "Light Scarf", Fashion, 6,40);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES(5, "Gaming Mouse", Technology, 8,30);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES(6, "Silver bracelet", Jewelry, 80,35);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES(7, "Cities: skylines", Videogames, 15,20);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES(8, "Handbag", Fashion, 18,10);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES(9, "Hard cover notebook", "Office stationary", 4, 70);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES(10, "Gaming keyboard", Technology, 25,45);