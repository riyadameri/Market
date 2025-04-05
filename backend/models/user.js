const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    idNumber: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    },
    birthDate: {
        type: Date,
        required: true
    },
    dateOfRegistration: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['user', 'seller', 'superadmin'],
        default: 'user'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    regions: [{
        type: String,
        trim: true
    }],
    shopName: {
        type: String,
        trim: true
    },
    shopDescription: {
        type: String,
        trim: true
    },
    shopLogo: {
        type: String
    },
    shopPones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    confirmationCode: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { 
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.confirmationCode;
            delete ret.resetPasswordToken;
            delete ret.resetPasswordExpires;
            return ret;
        }
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);