const express = require('express');
const { param, body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

// ✅ GET /api/v1/admin/users - Get All Users (Admin Only)
router.get('/', auth, authorize(['admin']), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users', details: error.message });
    }
});

// ✅ GET /api/v1/admin/users/:id - Get User by ID (Admin Only)
router.get('/:id', auth, authorize(['admin']), param('id').isMongoId().withMessage('Invalid User ID'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user', details: error.message });
    }
});

// ✅ PUT /api/v1/admin/users/:id - Update User (Admin Only)
router.put('/:id', auth, authorize(['admin']),
    param('id').isMongoId().withMessage('Invalid User ID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty.'),
    body('email').optional().isEmail().withMessage('Valid email is required.'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: 'Error updating user', details: error.message });
        }
    }
);

// ✅ DELETE /api/v1/admin/users/:id - Delete User (Admin Only)
router.delete('/:id', auth, authorize(['admin']), param('id').isMongoId().withMessage('Invalid User ID'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user', details: error.message });
    }
});

module.exports = router;
