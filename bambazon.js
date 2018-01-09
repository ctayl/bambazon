var mysql = require('mysql');
var inquirer = require('inquirer');

// Object that handles database connection (hi john)
var database = {

    connection: mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "2379",
        database: "bambazon"
    }),

    connect: function () {
        database.connection.connect(function (err) {
            if (err) throw (err);
            console.log(`connected as ${database.connection.threadId}`);
        });
    }
};

// customer object, contains methods for retreving inventory, buying items, and restocking items (ran out of time, intended for a supervisor object)
var customer = {

    // connects to database, fetches inventory, and depending on the truthiness of control, continues the app by running the purchase prompt customer.prompt();
    get: function (control) {

        if (control) {
            database.connect();

            database.connection.query("SELECT * FROM products", function (err, res) {
                if (err) throw (err);
                for (let i = 0; i < res.length; i++) {
                    let id = res[i].item_id;
                    let name = res[i].product_name;
                    let department = res[i].department_name;
                    let price = res[i].price;
                    let stock = res[i].stock_quantity;
                    console.log(`-------- ITEM ID: ${id} --------`);
                    console.log(`Item: ${name}`);
                    console.log(`Department: ${department}`);
                    console.log(`Price: ${price}`);
                    console.log(`Avalible: ${stock}`);
                    console.log(`------------------------------`);
                    console.log(" ");
                };
                
                database.connection.end();
            });
        } else {
            database.connect();

            database.connection.query("SELECT * FROM products", function (err, res) {
                if (err) throw (err);
                for (let i = 0; i < res.length; i++) {
                    let id = res[i].item_id;
                    let name = res[i].product_name;
                    let department = res[i].department_name;
                    let price = res[i].price;
                    let stock = res[i].stock_quantity;
                    console.log(`-------- ITEM ID: ${id} --------`);
                    console.log(`Item: ${name}`);
                    console.log(`Department: ${department}`);
                    console.log(`Price: ${price}`);
                    console.log(`Avalible: ${stock}`);
                    console.log(`------------------------------`);
                    console.log(" ");
                };
                customer.prompt();
            });
        }


    },

    // restocks items
    post: function (id, quantity) {
        database.connect();
        database.connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [quantity, id], function (err) {
            if (err) throw (err);
            console.log(`------------------------------`);
            console.log("Restock sucessful");
            console.log(`Product id: ${id}`);
            console.log(`Quantity stocked: ${quantity}`);
            console.log(`------------------------------`);
        });

        database.connection.end();
    },

    // prompts for item id and quantity, and passes the values in to customer.buy()
    prompt: function () {
        inquirer.prompt([{
            name: "id",
            type: "input",
            message: "Enter the ID of the item you would like to buy",
        },
        {
            name: "quant",
            type: "input",
            message: "How many would you like?"
        }
        ]).then(function (res) {
            customer.buy(res.id, res.quant);
        })
    },

    // method that deducts quantity from the item stock, and terminates the connection
    buy: function (id, quantity) {

        database.connection.query("SELECT * FROM products WHERE item_id = ?", [id], function (err, res) {
            if (err) throw (err);
            for (let i = 0; i < res.length; i++) {

                let name = res[i].product_name;
                let price = res[i].price;
                let stock = res[i].stock_quantity;

                if (stock >= quantity) {

                    database.connection.query({

                        sql: "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
                        values: [quantity, id]

                    }, function (err, res) {
                        if (err) throw err;
                        console.log(" ");
                        console.log(`------------------------------`);
                        console.log(`${quantity} ${name} bought for $${price} each!`);
                        let total = quantity * price;
                        console.log(`Your total is: $${total}`);
                        console.log(`------------------------------`);
                        console.log(" ");
                    });


                } else {
                    console.log("not enough in stock")
                }
                database.connection.end();
            };
        });
    },

    // starts the app by prompting the user for an action: shop or supervisor
    init: function () {
        inquirer.prompt([{
            name: 'method',
            type: 'list',
            choices: ['Shop', 'Supervisor'],
            message: "Make a selection: "
        }]).then(function (res) {
            if (res.method === 'Shop') {
                customer.get();
            } else if (res.method === 'Supervisor') {
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'method',
                        choices: ["Restock", "View"],
                        message: 'Pick an action: '
                    }
                ]).then(function (res) {

                    if (res.method === 'View') {
                        customer.get(true);
                    } else if (res.method === 'Restock') {
                        inquirer.prompt([{
                            type: 'input',
                            name: 'id',
                            message: 'RESTOCKING: Enter item ID: '
                        },
                        {
                            type: 'input',
                            name: 'quantity',
                            message: 'Enter quantity to restock: '
                        }
                        ]).then(function (res) {
                            customer.post(res.id, res.quantity);
                        })
                    }
                });

            }
        })
    }
}

// this function call initiates the app. customer.init() is the entry point to the control flow
customer.init();