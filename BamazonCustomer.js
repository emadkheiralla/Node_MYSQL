var inquirer = require('inquirer');
var MySql = require('mysql');
var Table = require('cli-table');

var connection = MySql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "", //Your password
    database: "Bamazon"
});

var table = new Table({
    head: ['Item ID', 'Item Name', 'Department Name', 'Item Price', '# Available'],
    colWidths: [10, 30, 20, 15, 15]
});

function showTable(){
	connection.query('SELECT * FROM Products', function(err, res) {
		if (err){
			throw err;
		}else{
		    for (var i = 0; i < res.length; i++) {
		    	table.push(
				    [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].Price, res[i].StockQuantity]
				);
		    }
	    }
	    console.log(table.toString());
	    myPrompt();
	});
}

function myPrompt(){
	var itemBuy = [{
		name: "chooseItem",
		message: "Please choose the Item ID of the product you want to purchase?"
	},
	{
		name: "chooseQuantity",
		message: "How many of this product would you like to purchase?"
	}];

	inquirer.prompt(itemBuy).then(function(answers){
		connection.query('SELECT * FROM Products WHERE ?', [{
			ItemID: answers.chooseItem
		}],function(error, result) {
		    if (error){
		    	throw error;
		    } else{
		    	var currentQuantity = result[0].StockQuantity;
		    	if(answers.chooseQuantity <= currentQuantity){ 
		    		 
		    		connection.query("UPDATE Products SET ? WHERE ?", [{
					    StockQuantity: currentQuantity - answers.chooseQuantity
					}, {
					    ItemID: answers.chooseItem
					}], function(err, res) {
					    if (err) {
					        throw err;
					    }
					    var totalSales = result[0].Price * answers.chooseQuantity;
					    console.log("Your total is " + totalSales + "!");
					});	
		    	}else{
		    		console.log("There is only " + currentQuantity + " available to choose from!");
		    	}
		    	connection.end();
		    }
		});
	});

}
showTable();












