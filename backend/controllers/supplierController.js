import UserModel from '../models/Users.js';
import { validationResult } from 'express-validator';
import PDFDocument from 'pdfkit';

// Get all users with optional sorting
export const getUsers = (req, res) => {
    const sortField = req.query.sortField || 'name'; // Default sort by name
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // Default ascending order

    UserModel.find({})
        .sort({ [sortField]: sortOrder })
        .then(users => res.json(users))
        .catch(err => res.status(500).json(err));
};

// Get a single user by ID
export const getUserById = (req, res) => {
    const id = req.params.id;
    UserModel.findById(id)
        .then(user => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => res.status(500).json(err));
};

// Update a user by ID with duplicate check
export const updateUserById = async (req, res) => {
    const id = req.params.id;
    const { name, company_name, product_name, contact_number, email } = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const existingUser = await UserModel.findOne({
            _id: { $ne: id },
            name,
            company_name,
            product_name,
            contact_number,
            email
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User with the same details already exists' });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { name, company_name, product_name, contact_number, email },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Delete a user by ID
export const deleteUserById = (req, res) => {
    const id = req.params.id;
    UserModel.findByIdAndDelete(id)
        .then(result => {
            if (result) {
                res.json(result);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => res.status(500).json(err));
};

// Create a new user with duplicate check
export const createUser = async (req, res) => {
    console.log("AddSupplier called with body:", req.body);

    const { name, company_name, product_name, contact_number, email } = req.body; // Ensure you destructure the body

    // Validate input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!name || !company_name || !product_name || !contact_number || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await UserModel.findOne({
            name, 
            company_name, 
            product_name, 
            contact_number, 
            email
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User with the same details already exists' });
        }

        const newUser = await UserModel.create({ name, company_name, product_name, contact_number, email });
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Example searchUsers function implementation
export const searchUsers = (req, res) => {
    const query = req.query.q || '';  // Get search query from request

    UserModel.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { company_name: { $regex: query, $options: 'i' } },
            { product_name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
        ]
    })
    .then(users => res.json(users))
    .catch(err => res.status(500).json(err));
};



// Generate PDF report for selected users with date, month, or year filters
// Generate PDF report for selected users with date, month, or year filters
export const generateReport = async (req, res) => {
    try {
        const { userIds, startDate, endDate, month, year } = req.body;
        let filter = {};

        if (userIds && userIds.length > 0) {
            filter._id = { $in: userIds };
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        if (month && year) {
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0);
            filter.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
        } else if (year) {
            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year, 11, 31);
            filter.createdAt = { $gte: startOfYear, $lte: endOfYear };
        }

        const users = await UserModel.find(filter).exec();

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found for the report.' });
        }

        const doc = new PDFDocument();
        let buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            res.setHeader('Content-Disposition', 'attachment; filename="SupplierReport.pdf"');
            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdfData);
        });

        // Add PDF content here based on users data
        doc.text('Supplier Report', { align: 'center' });
        doc.moveDown();
        users.forEach(user => {
            doc.text(`Name: ${user.name}, Company: ${user.company_name}, Email: ${user.email}`);
        });
        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
