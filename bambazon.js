var mysql = require('mysql');
var inquirer = require('inquirer');

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

var customer = {

    get: function () {
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
            };
            customer.prompt();
        });

    },

    post: function (name, department, price, stock) {
        database.connect();
        database.connection.query("INSERT INTO products SET ? ", {
            product_name: name,
            department_name: department,
            price: price,
            stock_quantity: stock
        }, function (err) {
            if (err) throw (err);
            console.log(`${stock} ${name} sucessfully posted for $${price} each in the ${department} department!`);
        });

        database.connection.end();
    },

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
                        console.log(`${quantity} ${name} bought for $${price} each!`);
                    });


                } else {
                    console.log("not enough in stock")
                }
                database.connection.end();
            };
        });
    },

    init: function () {
        inquirer.prompt([{
            name: 'method',
            type: 'list',
            choices: ['Buy', 'Post'],
            message: "Make a selection: "
        }]).then(function (res) {
            if (res.method === 'Buy') {
                customer.get();
            } else if (res.method === 'Post') {
                inquirer.prompt([{
                    type: 'input',
                    name: 'name',
                    message: 'Enter item name: '
                },
                {
                    type: 'input',
                    name: 'department',
                    message: 'Enter item department: '
                },
                {
                    type: 'input',
                    name: 'price',
                    message: 'Enter item price: '
                },
                {
                    type: 'input',
                    name: 'quantity',
                    message: 'Enter item quantity: '
                }
                ]).then(function (res) {
                    customer.post(res.name, res.department, res.price, res.quantity);
                })
            }
        })
    }
}

customer.init();
