

import express from 'express';
import multer from 'multer';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import sanitizeHtml from 'sanitize-html';
import fs from 'fs';
import Product from '../models/product.js';
import Order from '../models/order.js';
import User from '../models/user.js';

const router = express.Router();

// Create uploads folder if it doesn't exist
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration (removed fileFilter to allow all file types)
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max size
  // No fileFilter means all file types are allowed
});

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// Add product route
router.post('/add', limiter, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'brandLogo', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      userId,
      name,
      description,
      price,
      originalPrice,
      rentalPrice,
      category,
      regions,
      colors,
      sizes,
      rentalPeriods,
      stock
    } = req.body;

    // Basic validation
    if (!userId || !name || !description || !price || !originalPrice || !rentalPrice || !category || !regions || !colors || !sizes || !rentalPeriods) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Sanitize
    const sanitizedName = sanitizeHtml(name);
    const sanitizedDescription = sanitizeHtml(description);

    const product = new Product({
      userId,
      name: sanitizedName,
      description: sanitizedDescription,
      image: req.files['image'][0].filename,
      brandLogo: req.files['brandLogo'][0].filename,
      price,
      originalPrice,
      rentalPrice,
      category,
      regions,
      colors,
      sizes,
      rentalPeriods,
      stock
    });

    await product.save();

    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.post('/getAll', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get the newest 50 products to show on the home page
router.get('/list', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }).limit(50);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
//get product by id
router.get('/get/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
);

// get Products by userId 
router.get('/product/user/:userId', async (req, res) => {
  try {
    const products = await Product.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
router.delete('/product/remove/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }


    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// create order
router.post('/order/add', async (req, res) => {
  try {
    const { userPhone, orderNumber, productId, userId, quantity, sellerId, size, color } = req.body;
    if (!userPhone || !productId || !orderNumber || !userId || !quantity || !sellerId || !size || !color) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock' });
    }
    const order = new Order({
      userId,
      orderNumber,
      userPhone,
      sellerId,
      productId,
      orderDate: new Date(),
      status: 'Pending',
      quantity,
      size,
      color,
      totalPrice: product.price * quantity
    });
    await order.save();
    // Update product stock
    product.stock -= quantity;
    await product.save();
    res.status(200).json({ message: 'Order created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// get user orders by userId

router.get('/order/myorders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    if (!orders) {
      return res.status(404).json({ message: 'Orders not found' });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// get oreders for seller

router.get('/orders/supplier/:id', async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json// get oreders for seller({ message: 'Internal server error', error: error.message });
  }
});

// Get detailed order information including product and user data
router.get('/AllOrderData/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    

    const order = await Order.findById(orderId).sort({ createdAt: -1 });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get product details
    const product = await Product.findById(order.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get buyer (user) details
    const buyer = await User.findById(order.userId);
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    // Get seller details
    const seller = await User.findById(order.sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Construct response object with enhanced status information
    const orderData = {
      orderDetails: {
        _id: order._id,
        orderNumber: order.orderNumber,
        orderDate: order.orderDate,
        currentStatus: order.status,
        statusHistory: order.statusHistory || [],
        quantity: order.quantity,
        size: order.size,
        color: order.color,
        totalPrice: order.totalPrice,
        userPhone: order.userPhone,
        subtotal: order.Subtotal,
        shipping: order.shipping,
        tax: order.Tax
      },
      productDetails: {
        _id: product._id,
        name: product.name,
        description: product.description,
        image: product.image,
        brandLogo: product.brandLogo,
        price: product.price,
        originalPrice: product.originalPrice,
        rentalPrice: product.rentalPrice,
        category: product.category,
        stock: product.stock
      },
      buyerDetails: {
        _id: buyer._id,
        firstName: buyer.firstName,
        lastName: buyer.lastName,
        email: buyer.email,
        phone: buyer.phone,
        profileImage: buyer.image,
      },
      sellerDetails: {
        _id: seller._id,
        firstName: seller.firstName,
        lastName: seller.lastName,
        email: seller.email,
        phone: seller.phone,
        profileImage: seller.image,
        shopName: seller.shopName,
        shopLogo: seller.shopLogo,
        shopDescription: seller.shopDescription
      }
    };

    res.status(200).json(orderData);
  } catch (error) {
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
});



// Confirm order route
router.put('/order/confirm/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate input
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // Find and update the order
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        $push: { 
          statusHistory: {
            status,
            changedAt: new Date()
          }
        }
      },
      { new: true } // Return the updated document
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If order is being confirmed, you might want to perform additional actions
    if (status === 'Confirmed') {
      // Example: Send confirmation email/notification
      // You would implement this functionality separately
    }

    res.status(200).json({ 
      message: 'Order status updated successfully',
      order 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
});

router.delete('/order/remove/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});



export default router;