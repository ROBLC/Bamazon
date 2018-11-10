var mysql = require("mysql");
var Table = require('cli-table3');
var inquirer = require("inquirer");
var colors = require('colors');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n".green);
    start();


});

function start() {
    inquirer.prompt({
        type: "list",
        name: "managerAction",
        message: "What would you like to do",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
    }).then(function (answer) {
        switch (answer.managerAction) {
            case "Quit":
                connection.end();
                break;
            case "View Products for Sale":
                prodView();
                break;
            case "View Low Inventory":
                lowInv();
                break;
            case "Add to Inventory":
                addInv();
                break;
            case "Add New Product":
                addProd();
        };
    })
};

function printTables(rows) {
    const headers = ["item_id", "product_name", "department_name", "price", "stock_quantity"];
    var table = new Table({
        head: headers
    });

    rows.forEach(row => {
        table.push([row.item_id, row.product_name, row.department_name, row.price, row.stock_quantity])
    });
    console.log(table.toString());
};
function prodView() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\nWelcome here are the items availabe:\n")
        printTables(res);
        start()
    });
}
function lowInv() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5;", function (err, res) {
        if (res.length >= 1) {
            console.log("\nHere are the products with low inventory:\n")
            printTables(res);
        }
        else {
            console.log("No products with low inventory")
        }
        start();
    });
}
function addInv() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) console.log(err);
        inquirer.prompt([
            {
                name: "item",
                type: "input",
                message: "please input the item_id to which add inventory",
                validate: function (input) {

                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].item_id);
                    }
                    if (choiceArray.includes(parseFloat(input))) {
                        return true;
                    }
                    else {
                        console.log("\n*Please input a valid item_id*".red);
                        return false;
                    }
                },
            },
            {
                name: "quantity",
                type: "input",
                message: "How many do you want to add",
                validate: function (value) {
                    if (isNaN(value) === false && value > 0) {
                        return true;
                    }
                    console.log("\n*Please input a number bigger than 1*".red)
                    return false;
                }
            }
        ]).then(function (answer) {
            var quantityAdd = parseFloat(answer.quantity);
            var itemChosen = res[(parseFloat(answer.item) - 1)];
            var newQuantity = itemChosen.stock_quantity + quantityAdd;
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newQuantity
                    },
                    {
                        item_id: itemChosen.item_id
                    }
                ],
                function (err, res) {
                    console.log("\nYou added " + quantityAdd + " to " + itemChosen.product_name + "\n")
                    console.log(res.affectedRows + " product stock updated!\n".green);
                    start();
                });
        });


    });
};

function addProd() {
    connection.query("SELECT * FROM products", function (err, res) {
        inquirer.prompt([
            {
                name: "item_id",
                type: "input",
                message: "please input the new product's id",
                validate: function (input) {
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].item_id);
                    }
                    if (choiceArray.includes(parseFloat(input))) {
                        console.log("\n*Please input an id that doesn't exist*".red);
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
            {
                name: "product_name",
                type: "input",
                message: "please input the new product's name",
            },
            {
                name: "department_name",
                type: "input",
                message: "please input the new product's department",
            },
            {
                name: "price",
                type: "input",
                message: "please input the new product's price",
            },
            {
                name: "stock_quantity",
                type: "input",
                message: "please input the new product's stock quantity",
            },
        ]).then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    item_id: answer.item_id,
                    product_name: answer.product_name,
                    department_name: answer.department_name,
                    price: answer.price,
                    stock_quantity: answer.stock_quantity
                },
                function (err, res) {
                    console.log(res.affectedRows + " product added!\n".green);
                    start();
                }
            );
        });
    });


}