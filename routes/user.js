const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// ✅ POST /api/v1/user/signup - User Registration
router.post('/signup',
    body('name').notEmpty().withMessage('Name is required.'),
    body('username').notEmpty().withMessage('Username is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    body('role').optional().isIn(["admin", "hr", "manager", "employee"]).withMessage("Invalid role"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, username, email, password, role } = req.body;

        try {
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email or username already exists.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                name,
                username,
                email,
                password: hashedPassword,
                role: role || "employee"  // Default to employee if not provided
            });

            await newUser.save();
            res.status(201).json({ message: 'User created successfully', userID: newUser._id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
);



// ✅ POST /api/v1/user/login - User Login
router.post('/login',
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'User Not Found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            // Generate JWT Token
            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ message: 'Login Successful', token });
        } catch (error) {
            res.status(500).json({ error: 'Error logging in', details: error.message });
        }
    }
);

// ✅ GET /api/v1/user/profile - Get User Profile (Authenticated)
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching profile', details: error.message });
    }
});

module.exports = router;
