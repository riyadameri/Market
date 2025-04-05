const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');
const validator = require('validator');

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Utility functions
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

const sanitizeInput = (input) => {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {}
  });
};

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId, isActive: true });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account not active'
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Please authenticate'
    });
  }
};

router.post('/register', apiLimiter, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'shopImage', maxCount: 1 }
]), async (req, res) => {

  try {
    // Sanitize and validate inputs
    const {
      role = 'user',
      idNumber,
      firstName,
      lastName,
      phone,
      birthDate,
      shopName,
      regions,
      email,
      password
    } = req.body;
    console.log('Request body:', req.body);
    // Validate required fields
    const requiredFields = {
      idNumber, firstName, lastName, phone, birthDate, email, password
    };
    
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value || typeof value !== 'string') {
        return res.status(400).json({
          success: false,
          message: `${field} is required and must be a string`
        });
      }
    }

    // Additional validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    if (role === 'seller' && (!shopName || !regions)) {
      return res.status(400).json({
        success: false,
        message: 'Shop name and regions are required for sellers'
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email or phone number'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Process regions - handle both string and array input
    let processedRegions = [];
    if (regions) {
      if (typeof regions === 'string') {
        // Handle comma-separated string
        processedRegions = regions.split(',').map(region => sanitizeInput(region.trim()));
      } else if (Array.isArray(regions)) {
        // Handle array input
        processedRegions = regions.map(region => sanitizeInput(region));
      }
    }

    // Create new user
    const newUser = new User({
      role,
      idNumber: sanitizeInput(idNumber),
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      phone: sanitizeInput(phone),
      birthDate: new Date(birthDate),
      email: sanitizeInput(email),
      password: hashedPassword,
      isActive: false,
      confirmationCode
    });

    // Handle seller-specific fields
    if (role === 'seller') {
      newUser.shopName = sanitizeInput(shopName);
      newUser.regions = processedRegions;
      
      if (req.files && req.files['shopImage']) {
        newUser.shopLogo = req.files['shopImage'][0].path;
      }
    }

    // Handle profile image
    if (req.files && req.files['profileImage']) {
      newUser.image = req.files['profileImage'][0].path;
    }

    await newUser.save();

    // Send verification email
    const emailSent = await sendEmail({
      from: `"Fashion DZ" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification',
      html: `
        <h1>Welcome to Fashion DZ, ${sanitizeInput(firstName)}!</h1>
        <p>Please verify your email address by entering this code:</p>
        <h2>${confirmationCode}</h2>
        <p>This code will expire in 1 hour.</p>
      `
    });

    if (!emailSent) {
      await User.deleteOne({ _id: newUser._id });
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Verification email sent',
      userId: newUser._id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/users/verify
 * @desc    Verify user email
 * @access  Public
 */
router.post('/verify', apiLimiter, async (req, res) => {
  try {
    const { userId, verificationCode } = req.body;

    if (!userId || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'User ID and verification code are required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    if (user.confirmationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Activate account
    user.isActive = true;
    user.confirmationCode = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user);

    // Prepare user data for response
    const userData = user.toObject();
    delete userData.password;
    delete userData.confirmationCode;

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/users/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', apiLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required Redox ES : 102303'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials Redox ES : 202303'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account not verified. Please check your email.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials 402303'
      });
    }

    const token = generateToken(user);

    // Send login notification (async)
    sendEmail({
      from: `"Fashion DZ" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'New Login Detected',
      html: `
        <h1>Login Notification</h1>
        <p>Hello ${user.firstName},</p>
        <p>There was a login to your account at ${new Date().toLocaleString()}.</p>
        <p>If this wasn't you, please secure your account immediately.</p>
      `
    }).catch(err => console.error('Login notification error:', err));

    // Prepare response
    const userData = user.toObject();
    delete userData.password;
    delete userData.confirmationCode;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', apiLimiter, authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -confirmationCode')
      .populate('subscriptions', 'firstName lastName email image')
      .populate('shopPones', 'firstName lastName email image');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', apiLimiter, authMiddleware, async (req, res) => {
  try {
    const updates = Object.keys(req.body)
      .filter(key => ['firstName', 'lastName', 'phone', 'birthDate', 'shopName', 'regions'].includes(key))
      .reduce((obj, key) => {
        obj[key] = sanitizeInput(req.body[key]);
        return obj;
      }, {});

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -confirmationCode');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/users/profile-picture
 * @desc    Update profile picture
 * @access  Private
 */
router.put('/profile-picture', apiLimiter, authMiddleware, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { image: `/uploads/${req.file.filename}` },
      { new: true }
    ).select('-password -confirmationCode');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      imageUrl: user.image
    });

  } catch (error) {
    console.error('Profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile picture update',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/users/new-subscription
 * @desc    Add new subscription
 * @access  Private
 */
router.post('/new-subscription', apiLimiter, authMiddleware, async (req, res) => {
  try {
    const { sellerId } = req.body;

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: 'Seller ID is required'
      });
    }

    if (req.user._id.equals(sellerId)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot subscribe to yourself'
      });
    }

    const [user, seller] = await Promise.all([
      User.findById(req.user._id),
      User.findById(sellerId)
    ]);

    if (!user || !seller) {
      return res.status(404).json({
        success: false,
        message: 'User or seller not found'
      });
    }

    if (user.subscriptions.includes(sellerId)) {
      return res.status(400).json({
        success: false,
        message: 'Already subscribed to this seller'
      });
    }

    user.subscriptions.push(sellerId);
    seller.shopPones.push(user._id);

    await Promise.all([user.save(), seller.save()]);

    res.status(200).json({
      success: true,
      message: 'Subscription added successfully',
      subscriptions: user.subscriptions
    });

  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during subscription',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/users/remove-subscription/:sellerId
 * @desc    Remove subscription
 * @access  Private
 */
router.delete('/remove-subscription/:sellerId', apiLimiter, authMiddleware, async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: 'Seller ID is required'
      });
    }

    const [user, seller] = await Promise.all([
      User.findById(req.user._id),
      User.findById(sellerId)
    ]);

    if (!user || !seller) {
      return res.status(404).json({
        success: false,
        message: 'User or seller not found'
      });
    }

    if (!user.subscriptions.includes(sellerId)) {
      return res.status(400).json({
        success: false,
        message: 'Not subscribed to this seller'
      });
    }

    user.subscriptions = user.subscriptions.filter(id => !id.equals(sellerId));
    seller.shopPones = seller.shopPones.filter(id => !id.equals(user._id));

    await Promise.all([user.save(), seller.save()]);

    res.status(200).json({
      success: true,
      message: 'Subscription removed successfully',
      subscriptions: user.subscriptions
    });

  } catch (error) {
    console.error('Remove subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing subscription',
      error: error.message
    });
  }
});

module.exports = router;