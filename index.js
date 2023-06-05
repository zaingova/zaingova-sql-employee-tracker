const inquirer = require('inquirer');
const mysql2 = require('mysql2');

// presents user with a list of possible selections and proceeds according to their choice
getUserChoice = (() => {

})

// displays a table containing all the departments and department IDs
viewAllDepartments = (() => {

})


// displays a table containing all the roles, role IDs, the department that role belongs to, and the salary for that role
viewAllRoles = (() => {

})

// displays a table containing all employees information, including employee IDs, first names, last names, job titles, departments, salaries, and managers that the employees report to
viewAllEmployees = (() => {

})

// the user is prompted to enter a department name, and that department is added to the database
addDepartment = (() => {

})

// the user is prompted to enter the name, salary, and department for the role and that role is added to the database
addRole = (() => {

})

// the user is prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
addEmployee = (() => {

})

// the user is prompted to select an employee to update and their new role and this information is updated in the database 
updateEmployeeRole = (() => {

})

// calls getUserChoice function by default
getUserChoice();