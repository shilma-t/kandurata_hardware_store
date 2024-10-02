// models/Employee.js
import mongoose from 'mongoose'; // Use ES module import

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nic: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: Date, required: true },
  employeeType: { type: String, required: true }
});

// Create the Employee model
const Employee = mongoose.model('Employee', employeeSchema);

// Default export
export default Employee;
