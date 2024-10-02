//order controller

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

//placing orders on cash on delivery method 
const placeOrder =async (req,res)=>{
  try {

    const {userId,items,amount,address,province} =req.body;

    const orderData={
        userId,
        items,
        address,
        province,
        amount,
        PaymentMethod:"COD",
        payment:false,
        date:Date.now()
    }

    const newOrder =new orderModel(orderData)
    await newOrder.save()

    await userModel.findByIdAndUpdate(userId,{cartData:{}})

    res.json({success:true,message:"Order placed message from controller"})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}


//placing orders using strip method 
const placeOrderStripe =async (req,res)=>{
    
}


//placing orders using strip method 
const allOrders =async (req,res)=>{
    
}

//user data for frontend 
const userOrders =async (req,res)=>{
    
}

//update order status from logistic manager
const updateStatus =async (req,res)=>{
    
}

export{placeOrder,placeOrderStripe,allOrders,userOrders,updateStatus}