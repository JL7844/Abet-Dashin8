-- Seed data for Abet-Dashen Bank Attendance System

-- Insert departments
INSERT INTO departments (name, description) VALUES
  ('Operations', 'Core banking operations and transactions'),
  ('Customer Service', 'Customer support and relations'),
  ('Loans', 'Loan processing and management'),
  ('IT', 'Information technology and systems'),
  ('HR', 'Human resources and administration'),
  ('Finance', 'Financial planning and accounting'),
  ('Risk Management', 'Risk assessment and compliance'),
  ('Marketing', 'Marketing and communications')
ON CONFLICT (name) DO NOTHING;

-- Insert sample employees
INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, hire_date, is_active)
SELECT 
  'EMP001',
  'Abebe',
  'Kebede',
  'abebe.kebede@abetdashen.com',
  '+251911234567',
  d.id,
  'Senior Operations Officer',
  '2020-03-15',
  true
FROM departments d WHERE d.name = 'Operations'
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, hire_date, is_active)
SELECT 
  'EMP002',
  'Tigist',
  'Haile',
  'tigist.haile@abetdashen.com',
  '+251922345678',
  d.id,
  'Customer Service Lead',
  '2019-07-22',
  true
FROM departments d WHERE d.name = 'Customer Service'
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, hire_date, is_active)
SELECT 
  'EMP003',
  'Dawit',
  'Tadesse',
  'dawit.tadesse@abetdashen.com',
  '+251933456789',
  d.id,
  'Loan Officer',
  '2021-01-10',
  true
FROM departments d WHERE d.name = 'Loans'
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, hire_date, is_active)
SELECT 
  'EMP004',
  'Sara',
  'Mengistu',
  'sara.mengistu@abetdashen.com',
  '+251944567890',
  d.id,
  'IT Support Specialist',
  '2022-05-03',
  true
FROM departments d WHERE d.name = 'IT'
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, hire_date, is_active)
SELECT 
  'EMP005',
  'Yohannes',
  'Girma',
  'yohannes.girma@abetdashen.com',
  '+251955678901',
  d.id,
  'HR Manager',
  '2018-11-20',
  true
FROM departments d WHERE d.name = 'HR'
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, hire_date, is_active)
SELECT 
  'EMP006',
  'Meron',
  'Assefa',
  'meron.assefa@abetdashen.com',
  '+251966789012',
  d.id,
  'Financial Analyst',
  '2020-09-14',
  true
FROM departments d WHERE d.name = 'Finance'
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, hire_date, is_active)
SELECT 
  'EMP007',
  'Bereket',
  'Worku',
  'bereket.worku@abetdashen.com',
  '+251977890123',
  d.id,
  'Risk Analyst',
  '2021-06-28',
  true
FROM departments d WHERE d.name = 'Risk Management'
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, hire_date, is_active)
SELECT 
  'EMP008',
  'Hana',
  'Bekele',
  'hana.bekele@abetdashen.com',
  '+251988901234',
  d.id,
  'Marketing Coordinator',
  '2022-02-17',
  true
FROM departments d WHERE d.name = 'Marketing'
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, hire_date, is_active)
SELECT 
  'EMP009',
  'Solomon',
  'Tesfaye',
  'solomon.tesfaye@abetdashen.com',
  '+251999012345',
  d.id,
  'Operations Manager',
  '2017-04-05',
  true
FROM departments d WHERE d.name = 'Operations'
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, hire_date, is_active)
SELECT 
  'EMP010',
  'Rahel',
  'Desta',
  'rahel.desta@abetdashen.com',
  '+251910123456',
  d.id,
  'Customer Service Representative',
  '2023-01-09',
  true
FROM departments d WHERE d.name = 'Customer Service'
ON CONFLICT (employee_id) DO NOTHING;
