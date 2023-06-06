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

-- INSERT INTO employee (first_name, last_name)
-- VALUES 
-- ('John', 'Doe'),
-- ('Michael', 'Smith'),
-- ('Robert', 'Lowe');