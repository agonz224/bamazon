
var mysql      = require('mysql');
var inquirer   = require('inquirer');
var addedItems = "";
var itemPrice = 0;

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Qazplm123',
    database : 'bamazon',
    port: '3306'
});

connection.connect();

gimmeOptions();


function purchase()
{
 // listings();

        inquirer.prompt([

            {
                name: "itemID",
                message: "Select the ID of the item you would like to purchase?"
            }
        ]).then(function (answers) {
            console.log("You selected item #" + answers.itemID);

            connection.query('SELECT * FROM bamazonmarket ', function (error, results, fields) {
                if (error) throw error;
                var itemID = answers.itemID - 1;
                console.log("Product: " + results[itemID].product +  " Price: $" + results[itemID].price );
                addedItems = results[itemID].product;
                itemPrice = results[itemID].price;

                inquirer.prompt([

                    {
                        name: "itemRequest",
                        message: "What quantity would you like to purchase of " + addedItems + "?"
                    }
                ]).then(function (answers)
                {
                    if (results[itemID].stock_quantity > answers.itemRequest)
                    {
                        console.log("Perfect. That will be " + "$" + itemPrice*answers.itemRequest);
                        purchase();
                    }
                    else{
                    	console.log("I'm sorry. We just don't have enough "+ addedItems + " for you!")
                    	purchase();
                    }

                });



            });


        });

}


// this is where they're prompted to choose their action
function gimmeOptions()
{
    inquirer.prompt([
        {
            name: "shopordrop",
            message: "It's time to do some groceries, isn't it? \n [yes] \ [no] ",
        }, ])
        .then(function (answers) {
        console.log("choice selected: " + answers.shopordrop);
       
        if (answers.shopordrop == "yes")
        {
                console.log("Yum.")
                groceryShopping();
        }
            if (answers.shopordrop == "no")
                {
                	console.log("Thank you. Come again.")
                    connection.end();
                }
    });
};



function groceryShopping() {
    connection.query('SELECT * FROM bamazonmarket ', function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        purchase();
    });
};







