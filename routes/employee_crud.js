const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const router = express.Router();
const Employee = require('../schema/employeeschema');  

// ✅ GET All Employees: /api/v1/employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching employees', details: error.message });
    }
});

// ✅ POST Add Employee: /api/v1/employees/add
router.post('/add', [
    body('first_name').notEmpty().withMessage('First name is required.'),
    body('last_name').notEmpty().withMessage('Last name is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('position').notEmpty().withMessage('Position is required.'),
    body('salary').isNumeric().withMessage('Salary must be a number.'),
    body('date_of_joining').isISO8601().withMessage('Date of joining must be a valid date.'),
    body('department').notEmpty().withMessage('Department is required.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;

    try {
        const newEmployee = new Employee({
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department
        });

        await newEmployee.save();
        res.status(201).json({ message: 'Employee created successfully', employee_id: newEmployee._id });
    } catch (error) {
        res.status(500).json({ error: 'Error creating employee', details: error.message });
    }
});

// ✅ GET Employee by ID: /api/v1/employees/:eid
router.get('/:eid', [
    param('eid').isMongoId().withMessage('Valid employee ID is required.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { eid } = req.params;

    try {
        const employee = await Employee.findById(eid);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching employee details', details: error.message });
    }
});

// ✅ PUT Update Employee: /api/v1/employees/:eid
router.put('/:eid', [
    param('eid').isMongoId().withMessage('Valid employee ID is required.'),
    body('first_name').optional().notEmpty().withMessage('First name cannot be empty.'),
    body('last_name').optional().notEmpty().withMessage('Last name cannot be empty.'),
    body('email').optional().isEmail().withMessage('Valid email is required.'),
    body('position').optional().notEmpty().withMessage('Position cannot be empty.'),
    body('salary').optional().isNumeric().withMessage('Salary must be a number.'),
    body('date_of_joining').optional().isISO8601().withMessage('Date of joining must be a valid date.'),
    body('department').optional().notEmpty().withMessage('Department cannot be empty.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { eid } = req.params;
    const updateData = req.body;

    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(eid, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Error updating employee details', details: error.message });
    }
});

// ✅ DELETE Employee: /api/v1/employees/delete
router.delete('/delete', [
    query('eid').isMongoId().withMessage('Valid employee ID is required.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { eid } = req.query;

    try {
        const deletedEmployee = await Employee.findByIdAndDelete(eid);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting employee', details: error.message });
    }
});

module.exports = router;
