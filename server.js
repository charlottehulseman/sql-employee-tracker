const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const express = require("express");
const app = express()
const PORT = process.env.PORT || 3001


const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'password',
        database: 'employee_db',
    },
    console.log(`Connected to the employee_db database.`)
);


const menu = async () => {
    const menuResponse = await inquirer
        .prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'choice',
            choices: ['Update employee role', 'View all departments', 'View all roles', 'View all employees', 'Add department', 'Add role', 'Add employee'],
        })
    switch(menuResponse.choice){
        case "View all departments":
            viewDepartments()
            // View all depts function
            break;
        case "View all roles":
            viewRoles()
            // view all roles funciton
            break;
        case "View all employees":
            viewEmployees()
            break;
        case "Add role":
            addRole()
            break;
        case "Add department":
            addDept()
            break;
        case "Add employee":
            addEmployee()
            break;
        case "Update employee role":
            updateEmpRole()
            break;
    }
}

// View all departments
const viewDepartments = async () => {
    const allDepartments = await db.promise().query("SELECT * FROM department")
    console.table(allDepartments[0])
    menu()
}

// View all roles
const viewRoles = async () => {
    const allRoles = await db.promise().query("SELECT role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id")
    console.table(allRoles[0])
    menu()
}

// View all employees
const viewEmployees = async () => {
    const allEmployees = await db.promise().query("SELECT employee.first_name, employee.last_name, role.title, manager.last_name AS manager, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id")
    console.table(allEmployees[0])
    menu()
}

// Add new role
const addRole = async () => {
    const allDepartments = await db.promise().query("SELECT * FROM department")
    const newRole = await inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the title of the role?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of the role?"
        },
        {
            type: "list",
            name: "department_id",
            message: "Which department is the role in?",
            choices: allDepartments[0].map((dept) => ({name:dept.name, value:dept.id}))
        }
    ])
    db.promise().query("INSERT INTO role SET ?", newRole)
    console.log("Added role")
    menu()
}

// Add new department
const addDept = async () => {
    const newDept = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the new department?"
        }
    ])
    db.promise().query("INSERT INTO department SET ?", newDept)
    console.log("Added department")
    menu()
}

// Add new employee
const addEmployee = async () => {
    const allRoles = await db.promise().query("SELECT * FROM role")
    const allEmployees = await db.promise().query("SELECT first_name, last_name, id FROM employee")
    const newEmployee = await inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "Please enter the employee's first name."
        },
        {
            type: "input",
            name: "last_name",
            message: "Please enter the employee's last name."
        },
        {
            type: "list",
            name: "role_id",
            message: "What role does the employee have?",
            choices: allRoles[0].map((roles) => ({name:roles.title, value:roles.id}))
        },
        {
            type: "list",
            name: "manager_id",
            message: "What is the employee's manager ID?",
            choices: allEmployees[0].map((employee) => ({name:`${employee.first_name} ${employee.last_name}` , value:employee.id}))
        }
    ])
    db.promise().query("INSERT INTO employee SET ?", newEmployee)
    console.log("Added employee")
    menu()
}


// Update employee role
const updateEmpRole = async () => {
    const allDepartments = await db.promise().query("SELECT * FROM employee")
    const updatedEmpRole = await inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Which employee would you like to update?",
            choices: allEmployees[0].map((employee) => ({name:`${employee.first_name} ${employee.last_name}` , value:employee.id}))
        },
        {
            type: "list",
            name: "role",
            message: "Which role would you like to update the employee to?",
            choices: allRoles[0].map((roles) => ({name:roles.title, value:roles.id}))
        }
    ])
    db.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [updatedEmpRole.role, updatedEmpRole.employee])
    console.log("Employee role updated")
    menu()
}

menu()

