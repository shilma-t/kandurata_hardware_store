import express from 'express';
import mongoose from 'mongoose';
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

// DELETE order by _id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
    }

    try {
        const deletedOrder = await orderModel.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        console.log("Order deleted:", deletedOrder);
        res.status(200).json({ message: "Order deleted successfully", deletedOrder });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Error deleting order", error });
    }
});

// Add more routes here if necessary (e.g., POST, PUT)

export default router;
