const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Initialize Razorpay with fallback values
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_j1AXLCXpDzYQoa',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_j1AXLCXpDzYQoa',
});

// Create order
router.post('/createOrder', authenticateToken, async (req, res) => {
    try {
        const { amount } = req.body;
        
        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to paise
            currency: 'INR',
        });

        res.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Verify payment
router.post('/verifyOrder', authenticateToken, async (req, res) => {
    try {
        const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(orderId + '|' + razorpayPaymentId)
            .digest('hex');

        if (generatedSignature !== razorpaySignature) {
            return res.status(400).json({
                message: 'Payment verification failed',
                isOk: false
            });
        }

        // Update booking status or add premium status to user
        res.json({
            message: 'Payment verified successfully',
            isOk: true
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Payment verification failed' });
    }
});

module.exports = router;
