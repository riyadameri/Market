import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: String,
    sellerId: String,
    userPhone : String ,
    productId: String,
    orderDate: Date,
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    quantity: Number,
    totalPrice: Number,
    Subtotal: Number,
    shipping: Number,
    Tax: {
        type: Number,
        default: 5
    },
    colors: String,
    size: String,
    orderNumber : String

});
const Order = mongoose.model('Order', orderSchema);
export default mongoose.model('Order', orderSchema);