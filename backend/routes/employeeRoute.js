// employeeRoute.js
import express from 'express';
import * as employeeController from '../controllers/employeeController.js'; // Include the .js extension

const router = express.Router();

// Define your routes
router.post('/', employeeController.createEmployee);
router.get('/', employeeController.getEmployees);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

export default router; // Default export
