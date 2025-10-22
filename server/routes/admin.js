const express = require('express');
const Turf = require('../models/Turf');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Add new turf
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const turfData = {
            ...req.body,
            owner: req.user.id
        };

        const turf = new Turf(turfData);
        await turf.save();

        res.status(201).json({
            message: 'Turf added successfully',
            turf
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new owner
router.post('/addOwner', authenticateToken, async (req, res) => {
    try {
        const { username, email, password, phone, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            role: role || 'owner'
        });

        await user.save();

        res.status(201).json({
            message: 'Owner added successfully',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Edit turf
router.put('/edit/:id', authenticateToken, async (req, res) => {
    try {
        const turf = await Turf.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!turf) {
            return res.status(404).json({ error: 'Turf not found' });
        }

        res.json({
            message: 'Turf updated successfully',
            turf
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Edit turf (POST route for compatibility)
router.post('/edit', authenticateToken, async (req, res) => {
    try {
        const { id, ...updateData } = req.body;
        const turf = await Turf.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!turf) {
            return res.status(404).json({ error: 'Turf not found' });
        }

        res.json({
            message: 'Turf updated successfully',
            turf
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
