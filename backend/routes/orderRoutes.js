import express from 'express';
import Order from '../models/Order.js';

const orderRouter = express.Router();

// Create a new order
orderRouter.post('/', async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.status(201).send(order);
});

// Get all orders
orderRouter.get('/', async (req, res) => {
  const orders = await Order.find().populate('driver');
  res.send(orders);
});

export default orderRouter;
