import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: String,
    sellerId: String,
    userPhone : String ,
    productId: String,
    orderDate: Date,
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Refunded','Confirmed'],
        default: 'Pending'
    },
    statusHistory: [{
        status: String,
        changedAt: Date,
        changedBy: String, // userId of who changed the status
        note: String
    }],
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
export default mongoose.model('Order', orderSchema);