// employeeController.js
import Employee from '../models/Employee.js'; // Ensure the path is correct and include .js extension

// Create a new employee
export const createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    
    // Add validation if needed here
    
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(400).json({ message: 'Failed to create employee', error: error.message });
  }
};

// Get all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(400).json({ message: 'Failed to fetch employees', error: error.message });
  }
};

// Update an employee
export const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(400).json({ message: 'Failed to update employee', error: error.message });
  }
};

// Delete an employee
export const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(400).json({ message: 'Failed to delete employee', error: error.message });
  }
};
