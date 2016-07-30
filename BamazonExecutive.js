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
	message: "You are logged in as Executive! Please choose an option:",
	choices: ["View Product Sales by Department", "Create New Department"],
	name: "option"
}];

var newtable = new Table({
    head: ['Dept ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit'],
    colWidths: [10, 30, 20, 15, 15]
});


inquirer.prompt(menu).then(function(options){
	if(options.option === 'View Product Sales by Department'){
		viewProductSales();
	}else if(options.option === 'Create New Department'){
		createDepartment();
	}
});

function viewProductSales(){
	
	var query = 'SELECT Products.ProductName, Products.DepartmentName, Products.Price, Departments.DepartmentID, Departments.OverHeadCosts, Departments.TotalSales FROM Products ';
    query += 'INNER JOIN Departments ON (Products.DepartmentName = Departments.DepartmentName) ';

    connection.query(query, function(err, res) {
        console.log(res.length + " matches found!");
        for (var i = 0; i < res.length; i++) {
        newtable.push(
			    [res[i].DepartmentID, res[i].DepartmentName, res[i].OverHeadCosts, res[i].TotalSales, res[i].TotalSales - res[i].OverHeadCosts]
			);
	    }
	    console.log(newtable.toString());
    });
	connection.end();
}

function createDepartment(){
	var deptInfo = [{
		name: "departmentName",
		message: "What is your Department name?"
	},
	{
		name: "overheadCost",
		message: "What is the overhead cost of your department?"
	},
	{
		name: "totalSales",
		message: "Please set initial total sales to 0?"
	}];

	inquirer.prompt(deptInfo).then(function(answers){
		connection.query("INSERT into Departments SET ?", [{
	    	DepartmentName: answers.departmentName,
	    	OverHeadCosts: answers.overheadCost,
	    	TotalSales: answers.totalSales
	    }]); 
		connection.end();
	});
}