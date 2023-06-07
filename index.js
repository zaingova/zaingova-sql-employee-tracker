const inquirer = require('inquirer');
const mysql = require('mysql2');
const { printTable } = require('console-table-printer');
const title = require('./assets/ascii/title');

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
const questions = [
  'What would you like to do?',
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
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add department',
          'Add role',
          'Add employee',
          'Update employee-role'
        ]
      }
    ])

    // executes response based on user input
    .then((response) => {
      console.clear();
      if (response.response == 'View all departments') {
        viewAllDepartments();
      }
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
  db.query("SELECT id as 'Department ID', name as 'Department Name' FROM department", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      // calls showTable function if !err
      showTable(result);
      getUserChoice();
    }
  })
})

// displays a table containing all the roles, role IDs, the department that role belongs to, and the salary for that role
viewAllRoles = (() => {
  db.query("SELECT role.id as 'Role ID', role.title as 'Role Title', department.name as 'Department Name', role.salary as Salary FROM role LEFT JOIN department ON role.department_id = department.id", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      showTable(result);
      getUserChoice();
    }
  })
})

// displays a table containing all employees information, including employee IDs, first names, last names, job titles, departments, salaries, and managers that the employees report to
viewAllEmployees = (() => {
  db.query("SELECT e.id as 'Employee ID', e.first_name as 'First Name', e.last_name as 'Last Name', role.title as 'Role Title', department.name as Department, role.salary as Salary, CONCAT(m.first_name, ' ', m.last_name) as Manager FROM employee e JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id LEFT OUTER JOIN employee m ON e.manager_id = m.id", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      showTable(result);
      getUserChoice();
    }
  })
})

// the user is prompted to enter a department name, and that department is added to the database
addDepartment = (() => {

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'response',
        message: 'Which department would you like to add? (3-character minimum)',

        validate: function (input) {
          if (input.length < 3)
            throw new Error('Please enter a department with a valid length!');
          return true;
        }
      }
    ])
    .then((response) => {
      console.log(response.response);
      db.query(`INSERT INTO department (name) VALUES ('${response.response}');`, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          getUserChoice();
        }
      })
    })


})

// the user is prompted to enter the name, salary, and department for the role and that role is added to the database
addRole = () => {
  db.query('SELECT * FROM department', (err, response) => {
    const depts = [];

    for (let i = 0; i < response.length; i++) {
      depts.push(response[i].name);
    }

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'roleName',
          message: 'What role would you like to add? (3-character minimum)',
          validate: function (data) {
            if (data.length < 3)
              throw new Error('Input must be at least 3 characters long!');
            return true;
          }
        },
        {
          type: 'input',
          name: 'roleSalary',
          message: 'What will be the salary?',
          validate: function (data) {
            if (isNaN(data))
              throw new Error('Salary data must be a number!');
            return true;
          }
        },
        {
          type: 'list',
          name: 'deptName',
          message: 'Which department would you like to add this role to?',
          choices: depts
        }
      ])
      .then((data) => {
        let deptId;

        for (let i = 0; i < response.length; i++) {
          if (data.deptName == response[i].name)
            deptId = i + 1;
        }

        db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${data.roleName}', ${data.roleSalary}, ${deptId});`, (err, result) => {
          if (err) {
            console.log(err)
          } else {
            viewAllRoles();
          }
        })
      })
  })
};

// the user is prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
addEmployee = (() => {
  getUserChoice();
})

// the user is prompted to select an employee to update and their new role and this information is updated in the database 
updateEmployeeRole = (() => {
  getUserChoice();
})

showTable = ((data) => {
  console.log('\n');
  printTable(data);
  console.log('\n');
})

// calls getUserChoice function by default
console.log(title);
getUserChoice();