import express from 'express';
import multer from 'multer';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import sanitizeHtml from 'sanitize-html';
import fs from 'fs';
import Product from '../models/product.js';
import Order from '../models/order.js';
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
    const orders = await Order.find({ userId: req.params.userId });
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
    const orders = await Order.find({ sellerId: req.params.id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


export default router;