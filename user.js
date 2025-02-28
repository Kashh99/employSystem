const express = require('express');
const { body, validationResult } = require('express-validator'); // Import validation functions
const router = express.Router();
const User = require('./schema/userschema');
const bcrypt = require('bcryptjs');

//POST /api/vi/user/signup 

router.post('/signup', 
    // Validation rules
    body('username').notEmpty().withMessage('Username is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    
    async (req, res) => {
        const errors = validationResult(req); // Check for validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Return errors if validation fails
        }

        const { username, email, password } = req.body;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists.' });
            }

            // Create new user
            const newUser = new User({
                username,
                email,
                password,
            });

            await newUser.save();
            res.status(201).json({ message: 'User created successfully', userID: newUser._id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// POST /api/v1/user/login
router.post('/login', 
    // Validation rules
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
    
    async (req, res) => {
        const errors = validationResult(req); // Check for validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Return errors if validation fails
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

            res.status(200).json({ message: 'Login Successful', user: user.username });
        } catch (error) {
            res.status(500).json({ error: 'Error logging in', details: error });
        }
    }
);

module.exports = router; // Export the router