import productModel from "../models/productModel.js";
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs


// Add product item
const addProduct = async (req, res) => {
    let image_filename = req.file ? req.file.filename : ''; 

    // Extract additional data from request body
    const { name, description,category, wholesalePrice, retailPrice, quantity, supplierName } = req.body;
    
    // Generate a unique product ID
    const productId = `PROD-${uuidv4()}`;
    
    // Create a new product instance
    const product = new productModel({
        productId,
        image: image_filename, 
        name,
        description,
        category,
        wholesalePrice,
        retailPrice,
        quantity: parseInt(quantity, 10),
        supplierName,
        date: new Date(),
        
    });

    try {
        await product.save();
        res.json({ success: true, message: "PRODUCT added" });
    } catch (error) {
        console.error(error); // Use console.error for errors
        res.json({ success: false, message: "Error adding Product item" });
    }
};

// List all products
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, data: products });
    } catch (error) {
        console.error(error); // Use console.error for errors
        res.json({ success: false, message: "Error retrieving products" });
    }
};

// Remove product
const removeProduct = async (req, res) => {
    try {
        // Find the product by ID
        const product = await productModel.findById(req.body.id);
        if (product) {
            // Delete the product image from the filesystem
            if (product.image) {
                fs.unlink(`uploads/${product.image}`, (err) => {
                    if (err) {
                        console.error("Error deleting image file:", err);
                    }
                });
            }
            
            // Delete the product from the database
            await productModel.findByIdAndDelete(req.body.id);
            res.json({ success: true, message: "Product removed" });
        } else {
            res.json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        console.error(error); // Use console.error for errors
        res.json({ success: false, message: "Error removing product" });
    }
};

//update product
const updateProduct = async (req, res) => {
    try {
      const { id, name, category, price } = req.body;
      const updatedProduct = await productModel.findByIdAndUpdate(id, { name, category, price }, { new: true });
  
      if (!updatedProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      res.status(200).json({ success: true, data: updatedProduct, message: "Product updated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

 


export { addProduct, listProduct, removeProduct,updateProduct };
