import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    userId: String,
    name: String,
    description: String,
    image: String,
    brandLogo: String,
    price: Number,
    originalPrice: Number,
    rentalPrice: Number,
    category: String,
    regions: [String],
    colors: [String],
    sizes: [String],
    rentalPeriods: [String],
    stock: Number
  });
  
  const Product = mongoose.model('Product', productSchema);
  
export default mongoose.model('Product', productSchema);