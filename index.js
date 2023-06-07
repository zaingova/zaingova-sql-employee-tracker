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
  // selects all data from department table
  db.query('SELECT * FROM department', (err, response) => {
    const depts = [];

    // stores all department names in new variable
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

          // uses stores department names here
          choices: depts
        }
      ])
      .then((data) => {
        // creates empty variable called deptId
        let deptId;

        // looks for a match between selected department and possible departments
        for (let i = 0; i < response.length; i++) {
          if (data.deptName == response[i].name)
            // sets deptId equal to this value (+ 1 because index starts at 0)
            deptId = i + 1;
        }

        // inserts this data into the role table
        db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${data.roleName}', ${data.roleSalary}, ${deptId});`, (err, result) => {
          if (err) {
            console.log(err)
          } else {
            // displays an updated table containing roles
            viewAllRoles();
          }
        })
      })
  })
};

// the user is prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
addEmployee = (() => {
  inquirer
    // prompts user for first and last name
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "What is the employee's first name?",
        validate: function (data) {
          if (data.length == 0)
            throw new Error('Field cannot be empty!');
          return true;
        }
      },
      {
        type: 'input',
        name: 'last_name',
        message: "What is the employee's last name?",
        validate: function (data) {
          if (data.length == 0)
            throw new Error('Field cannot be empty!');
          return true;
        }
      },
    ])
    // stores first and last name in variables
    .then((data) => {
      let first_name = data.first_name
      let last_name = data.last_name;
      // creates empty array called roles
      let roles = [];

      db.query(`SELECT role.id, role.title FROM role`, (err, response) => {
        for (let i = 0; i < response.length; i++) {
          // iterates through all roles and stores them in the array
          roles[i] = response[i].title;
        }
        // prompts user for the role
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles
            }
          ])
          .then((data) => {
            // creates empty variables for roleId and managerId
            let roleId;
            let managerId;

            // compares role selection to all available roles
            for (let i = 0; i < response.length; i++) {
              if (data.role == response[i].title)
                // sets the id accordingly
                roleId = i + 1;
            }

            // new db query for employee data
            db.query('SELECT * FROM employee', (err, response) => {

              // maps out data from query response into array of objects with name (being employees' first and last names concatenated), and their associated id
              let managers = response.map
                (({ id, first_name, last_name }) =>
                  ({ name: first_name + " " + last_name, id: id }));

              // adds an object to managers to give the option for 'no manager'
              managers.push({ name: 'None', id: 0 });

              // prompts user for manager selection
              inquirer
                .prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                .then((data) => {
                  // sets manager id according to selection
                  for (let i = 0; i < managers.length; i++) {
                    if (data.manager == 'None')
                      managerId = null;
                    else if (data.manager == managers[i].name)
                      managerId = managers[i].id;
                  }

                  // final db query for inserting new employee data into employee table
                  db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${roleId}, ${managerId})`, (err, response) => {
                    if (err) {
                      console.log(err)
                    } else {
                      // displays an updated table containing roles
                      viewAllEmployees();
                    }
                  })
                })
            })
          })
      })
    })
})

// the user is prompted to select an employee to update and their new role and this information is updated in the database 
updateEmployeeRole = (() => {
  db.query('SELECT * FROM employee', (err, response) => {

    let employees = response.map
      (({ id, first_name, last_name }) =>
        ({ name: first_name + " " + last_name, id: id }));

    console.log(employees);

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee',
          message: 'Which employee would you like to update?',
          choices: employees
        }
      ])
      .then((data) => {
        let employeeId;
        for (let i = 0; i < employees.length; i++) {
          if (data.employee == employees[i].name) {
            employeeId = employees[i].id;
          }
        }

        db.query('SELECT * FROM role', (err, response) => {
          let roles = response.map
            (({ id, title }) =>
              ({ title: title, id: id }));

          let roleTitles = [];

          for (let i = 0; i < roles.length; i++) {
            roleTitles.push(roles[i].title);
          }

          //console.log(roleTitles);

          inquirer
            .prompt([
              {
                type: 'list',
                name: 'role',
                message: 'What role do you want to assign to the selected employee?',
                choices: roleTitles
              }
            ])
            .then((data) => {
              let roleId;
              for (let i = 0; i < roles.length; i++) {
                if (data.role == roles[i].title) {
                  roleId = roles[i].id;
                }
              }

              db.query(`UPDATE employee SET role_id = ${roleId} WHERE employee.id = ${employeeId}`, (err, response) => {
                if (err) {
                  console.log(err)
                } else {
                  // displays an updated table containing roles
                  viewAllEmployees();
                }
              })
            })
        })
      })
  })
})

showTable = ((data) => {
  console.log('\n');
  printTable(data);
  console.log('\n');
})

// calls getUserChoice function by default
console.log(title);
getUserChoice();