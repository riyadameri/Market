const express = require('express');
const router = express.Router();
const User = require('../models/user');
const user = require('../models/user');
console.log('User routes initialized...');

router.post('/test',
    (req, res) => {
        console.log('User route hit...');
        res.status(200).json({ message: 'User route is working' });
    }
)

router.post('/register',
    async (req, res) => {
        console.log('Registering a new user...');

        const timeout = setTimeout(() => {
            res.status(503).json({ message: 'Request timed out' });
        }, 10000); // 10 seconds timeout

        const { firstName, lastName, email, phone, password, birthDate, role, image, shopName, shopDescription, shopLogo, shopPones } = req.body;
        try {
            const newUser = new User({
                firstName,
                lastName,
                email,
                phone,
                password,
                birthDate,
                role,
                image,
                shopName,
                shopDescription,
                shopLogo,
                shopPones
            });
            await newUser.save();
            clearTimeout(timeout); // Clear the timeout if the operation completes
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            clearTimeout(timeout); // Clear the timeout in case of an error
            res.status(500).json({ message: 'Error registering user', error });
        }
    }
);

router.post('/new-subscription',
    async (req, res) => {
        console.log('Adding subscription...');

        const { userId, sellerId } = req.body;

        try {
            // Find the user and update their subscriptions
            const user = await User.findById(userId);
            const seller = await User.findById(sellerId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if the seller is already in the subscriptions
            if (user.subscriptions.includes(sellerId)) {
                return res.status(400).json({ message: 'Seller already subscribed' });
            }

            // Add the seller to the subscriptions array
            user.subscriptions.push(sellerId);
            seller.shopPones.push(userId);
            
            await user.save();
            await seller.save();

            res.status(200).json({ message: 'Subscription added successfully', user });
        } catch (error) {
            res.status(500).json({ message: 'Error adding subscription', error });
        }
    }
);
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Logging in user...');

    try {
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(404).json({ message: 'Incorrect email or password' });
        }

        res.status(200).json({ message: 'User logged in successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});



module.exports = router;