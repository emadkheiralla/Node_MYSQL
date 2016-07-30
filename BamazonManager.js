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

var menu = [{
	type: "list",
	message: "Welcome to Bamazon Management System! Please choose an option:",
	choices: ["viewProducts", "viewLowInventory", "addToInventory", "addNewProduct", "exit"],
	name: "option"
}];



function myPrompt(){
	inquirer.prompt(menu).then(function(options){
		if(options.option === 'viewProducts'){
			viewProducts();
		}else if(options.option === 'viewLowInventory'){
			viewLowInventory();
		}else if(options.option === 'addToInventory'){
			addToInventory();
		}else if(options.option === 'addNewProduct'){
			addNewProduct();
		}else if(options.option === 'exit'){
			connection.end();
		}
	});
}

function viewProducts(){
	var table1 = new Table({
	    head: ['Item ID', 'Item Name', 'Department Name', 'Item Price', '# Available'],
	    colWidths: [10, 30, 20, 15, 15]
	});
	connection.query('SELECT * FROM Products', function(err, res) {
		if (err){
			throw err;
		}else{
		    for (var i = 0; i < res.length; i++) {
		    	table1.push(
				    [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].Price, res[i].StockQuantity]
				);
		    }
	    }
	    console.log(table1.toString());
	    myPrompt();
	});
}

function viewLowInventory(){
	var table2 = new Table({
	    head: ['Item ID', 'Item Name', 'Department Name', 'Item Price', '# Available'],
	    colWidths: [10, 30, 20, 15, 15]
	});
	connection.query('SELECT * FROM Products WHERE StockQuantity < 5', function(err, res) {
		if (err){
			throw err;
		}else{
		    for (var i = 0; i < res.length; i++) {
		    	table2.push(
				    [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].Price, res[i].StockQuantity]
				);
		    }
	    }
	    console.log(table2.toString());
	    myPrompt();
	});
}

function addToInventory(){

	connection.query("SELECT * from Products", function(err, res) {
		var items = [];
		
	    for (var i = 0; i < res.length; i++) {
	    	items.push(res[i].ProductName);
	    }

		var productInfo = [{
			name: "productName",
			message: "Which product would you like to update?",
			type: "list",
			choices: items
		},
		{
			name: "thisMany",
			message: "How many would you like to add?"
		}];

		inquirer.prompt(productInfo).then(suum);
	});
}

function addNewProduct(){
	
	var productInfo = [{
		name: "productName",
		message: "What is your product name?"
	},
	{
		name: "departmentName",
		message: "What department are you placing this product in?"
	},
	{
		name: "productPrice",
		message: "How much do you want for this product?"
	},
	{
		name: "productQuantity",
		message: "How many of this product do you want to post?"
	}];

	inquirer.prompt(productInfo).then(post);
}

function suum(result){
	connection.query('SELECT * FROM Products WHERE ?', [{
		ProductName: result.productName
	}],function(error, answer) {
	    if (error){
	    	throw error;
	    } else{
	    	var currentQuantity = answer[0].StockQuantity;
			connection.query("UPDATE Products SET ? WHERE ?", [{
			    StockQuantity: currentQuantity + parseInt(result.thisMany)
			}, {
			    ProductName: result.productName
			}], function(err, res) {
			    if (err) {
			        throw err;
			    }
			    console.log("Your product was updated by " + result.thisMany + "!");
			    myPrompt();
			});
		}
	});
}

function post(product){
	connection.query("INSERT INTO Products SET ?", {
	    ProductName: product.productName,
	    DepartmentName: product.departmentName,
	    Price: product.productPrice,
	    StockQuantity: product.productQuantity
	}, function(err, res) {
	    if (err) {
	        throw err;
	    }
	    console.log("Thank you for posting your product to Bamazon!");
	    myPrompt();
	});
}

myPrompt();