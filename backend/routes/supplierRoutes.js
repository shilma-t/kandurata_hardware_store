import express from 'express';
import {
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    createUser,
    searchUsers,
    generateReport
} from '../controllers/supplierController.js';

const router = express.Router();

// Define routes
router.get('/getUsers', getUsers);  // Changed from '/' to '/getUsers'
router.get('/getUser/:id', getUserById);
router.put('/updateUser/:id', updateUserById);
router.delete('/deleteUser/:id', deleteUserById);
router.post('/createUser', createUser);  // Use lowercase to keep naming consistent
router.get('/search', searchUsers);
router.post('/generateReport', generateReport);

export default router;
