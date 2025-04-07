import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
console.log('Initializing database connection...');

const db = process.env.DB_URL;

const connectToDatabase = async () => {
    const startTime = Date.now(); 

    try {
        await mongoose.connect(db);
        const endTime = Date.now(); // End timer
        console.log(`⛃ Database connected successfully ✅ (Time taken: ${endTime - startTime}ms)`);
    } catch (err) {
        console.error('Database connection failed ❌', err);
        process.exit(1); // Exit process with failure
    }
};

connectToDatabase();

export default mongoose; ;