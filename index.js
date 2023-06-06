const inquirer = require('inquirer');
const mysql = require('mysql2');

// establish connection to MySQL database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Mrsub123',
    database: 'employees_db'
  },

  console.log(`Connected to the employees_db database.`)
);

db.connect();

// list of all possible questions to ask the user
const questions = ['What would you like to do?',
  "What is the name of the department?",
  "What is the name of the role?",
  "What is the salary of the role?",
  "Which department does the role belong to?",
  "What is the employee's first name?",
  "What is the employee's last name?",
  "What is the employee's role?",
  "Who is the employee's manager?",
  "Which employee's role do you want to update?",
  "What role do you want to assign to the selected employee?"
]

// presents user with a list of possible selections and proceeds according to their choice
getUserChoice = (() => {

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'response',
        message: questions[0],
        choices: ['View all departments',
          'View all roles',
          'View all employees',
          'Add department',
          'Add role',
          'Add employee',
          'Update employee-role'
        ]
      }
    ])

    .then((response) => {
      if (response.response == 'View all departments')
        viewAllDepartments();
      else if (response.response == 'View all roles')
        viewAllRoles();
      else if (response.response == 'View all employees')
        viewAllEmployees();
      else if (response.response == 'Add department')
        addDepartment();
      else if (response.response == 'Add role')
        addRole();
      else if (response.response == 'Add employee')
        addEmployee();
      else if (response.response == 'Update employee-role')
        updateEmployeeRole();
    })
})

// displays a table containing all the departments and department IDs
viewAllDepartments = (() => {
  db.query("SELECT name as Department_Name, id as Department_ID FROM department", (err, result) => {
    err ? console.log("Connection unsuccessful") : console.log(result);
  });

  //getUserChoice();
})


// displays a table containing all the roles, role IDs, the department that role belongs to, and the salary for that role
viewAllRoles = (() => {
  getUserChoice();
})

// displays a table containing all employees information, including employee IDs, first names, last names, job titles, departments, salaries, and managers that the employees report to
viewAllEmployees = (() => {
  getUserChoice();
})

// the user is prompted to enter a department name, and that department is added to the database
addDepartment = (() => {
  getUserChoice();
})

// the user is prompted to enter the name, salary, and department for the role and that role is added to the database
addRole = (() => {
  getUserChoice();
})

// the user is prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
addEmployee = (() => {
  getUserChoice();
})

// the user is prompted to select an employee to update and their new role and this information is updated in the database 
updateEmployeeRole = (() => {
  getUserChoice();
})

// calls getUserChoice function by default
console.log(`  ___                  _                          
 | __|  _ __    _ __  | |  ___   _  _   ___   ___ 
 | _|  | '  \\  | '_ \\ | | / _ \\ | || | / -_) / -_)
 |___| |_|_|_| | .__/ |_| \\___/  \\_, | \\___| \\___|
  _____        |_|          _    |__/             
 |_   _|  _ _   __ _   __  | |__  ___   _ _       
   | |   | '_| / _  | / _| | / / / -_) | '_|      
   |_|   |_|   \\__,_| \\__| |_\\_\\ \\___| |_|        
                                                  `)
getUserChoice();