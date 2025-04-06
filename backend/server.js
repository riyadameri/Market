import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import './config/config.js';
import userRoutes from './routes/user.js';
import productRouter from './routes/product.js';

dotenv.config();

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/user', userRoutes);
app.use('/product', productRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🖥 Server is running on port ${PORT} ✅`);
});
