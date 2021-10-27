USE employee_db;

INSERT INTO department
(name)
VALUES("Engineering"), ("Finance"), ("Legal"), ("Sales");

INSERT INTO role
(title, salary, department_id)
VALUES("Software Engineer II", 95000, 1),("Quantitative Analyst", 73000, 2), ("Legal Services Director", 110000, 3), ("Sales Representative", 68000, 4);

INSERT INTO employee
(first_name, last_name, role_id, manager_id)
VALUES("Jonathan", "Newman", 1, NULL), ("Ryan", "Allen", 2, 1), ("Kellie", "Kumasaka", 3, 1), ("Charlotte", "Hulseman", 4, 1);