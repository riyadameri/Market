const mongoose = require('mongoose');
const dotenv = require('dotenv');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,  // تصحيح: كان مكتوب Snameing بالخطأ
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    birthDate: {
        type: Date,
        required: true ,
    },
    dateOfRegistration: {
        type : Date,
        default: Date.now,
    },
    role: {
        type: String,
        enum: ['user', 'seller', 'superadmin'],
        default: 'user',
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  // يشير إلى نموذج المستخدم نفسه
    }],
    regions: [{
        type: String,
        ref: 'Region'  // يشير إلى نموذج المنطقة
    }],
    shopName: {
        type: String,
        required: false,
    },
    shopDescription: {
        type: String,
        required: false,
    },
    shopLogo: {
        type: String,
        required: false,
    },
    shopPones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // يشير إلى نموذج المستخدم نفسه
        required: false,
    }],
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);