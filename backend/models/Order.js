import mongoose from 'mongoose';

// Define the schema for the order
const orderSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  location: { type: String, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }
});

// Create or get the model for the schema
const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;
