var mysql = require("mysql");
var Table = require('cli-table3');
var inquirer = require("inquirer");

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
    console.log("connected as id " + connection.threadId + "\n");
    start();


});

function printTables(rows) {
    const headers = ["item_id", "product_name", "department_name", "price", "stock_quantity"];
    var table = new Table({
        head: headers
    });

    rows.forEach(row => {
        table.push([row.item_id, row.product_name, row.department_name, row.price, row.stock_quantity])
    });
    console.log("Welcome here are the items availabe \n----------------------------------------")
    console.log(table.toString());
}

function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        printTables(res);
        buy();


    });
}
function buy() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) console.log("-3", err);

        inquirer.prompt([
            {
                name: "itemToBuy",
                type: "input",
                message: "please input the item_id that you wish to buy",
                validate: function (input) {

                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].item_id);
                    }
                    if (choiceArray.includes(parseFloat(input))) {
                        return true;
                    }
                    else {
                        console.log("\n*Please input a valid item_id*");
                        return false;
                    }
                },
            },
            {
                name: "quantity",
                type: "input",
                message: "How many do you want",
                validate: function (value) {
                    if (isNaN(value) === false && value > 0) {
                        return true;
                    }
                    console.log("\n*Please input a number bigger than 1*")
                    return false;
                }
            }
        ]).then(function (answer) {
            var quantity = parseFloat(answer.quantity);
            var itemChosen = results[(parseFloat(answer.itemToBuy) - 1)];
            if (quantity > 1) {
                console.log("You chose: " + quantity + " " + itemChosen.product_name + "s");
            }
            else {
                console.log("You chose: " + quantity + " " + itemChosen.product_name);
            }
            console.log("checking our stock.... \n ")
            if (quantity <= itemChosen.stock_quantity) {
                console.log("Yeah, we have enough stock for your order!!\n");
                newQuantity = itemChosen.stock_quantity - quantity;
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newQuantity
                        },
                        {
                            product_name: itemChosen.product_name
                        }
                    ],
                    function (err, res) {
                        console.log("Your total is: $ " + (itemChosen.price * quantity) + "\n\n")
                        console.log(res.affectedRows + " product stock updated!");
                        whatNow();
                    }
                );
            }
            else {
                console.log("Insufficient Stock Quantity!!!")
            }
        });
    });

};

function whatNow() {
    inquirer.prompt({
        type: "list",
        name: "nextAction",
        message: "What would you like to do",
        choices: ["quit", "buy more!"]
    }).then(function (answer) {
        switch (answer.nextAction) {
            case "quit":
                connection.end();
                break;
            case "buy more!":
                start();
                break;
        }

    });
}








