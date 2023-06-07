INSERT INTO department (name)
VALUES 
('Finance'),
('Software Engineering'),
('Legal'),
('Marketing'),
('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES 
('Accountant', 80000, 1),
('Accounting Lead', 110000, 1),
('Software Engineer', 80000, 2),
('Lawyer', 120000, 3),
('Marketing Lead', 95000, 4);

-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES 
-- ('John', 'Doe', 2, 1),
-- ('Michael', 'Smith', 1, null),
-- ('Robert', 'Lowe', 1, 1),
-- ('Jean', 'Brandt', 4, null),
-- ('Patty', 'Lane', 5, 3);