// backend/routes/orderRoutes.js

import express from 'express';
import orderModel from '../models/Order.js';  // Adjust the path as necessary

const router = express.Router();

// GET all orders
router.get('/', async (req, res) => {
    console.log("Fetching orders...");
    try {
        const orders = await orderModel.find({});
        console.log("Orders retrieved:", orders);
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error retrieving orders:", error);
        res.status(500).json({ message: "Error retrieving orders", error });
    }
});

// Add more routes here if necessary (e.g., POST, PUT, DELETE)

export default router;
