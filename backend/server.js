import express from 'express';
import dotenv from 'dotenv';
import './config/config.js';
import cors from 'cors';
import userRoutes from './routes/user.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log(`🖥 Server is running on port ${PORT}  ✅`);
});