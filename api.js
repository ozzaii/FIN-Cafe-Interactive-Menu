
// api.js
const express = require('express');
const router = express.Router();
const { getDatabase } = require('./database');
const { ObjectId } = require('mongodb');
const { io } = require('./server');
const { registerStaff, loginStaff, authenticateStaff } = require('./auth');
const { body, validationResult } = require('express-validator');

// ... (previous imports and routes)

router.post('/place-order', [
    body('customerName').notEmpty().trim().escape(),
    body('tableNumber').notEmpty().isNumeric(),
    body('items').isArray({ min: 1 }),
    body('items.*.id').notEmpty(),
    body('items.*.quantity').isInt({ min: 1 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const db = getDatabase();
        const order = { ...req.body, status: 'Pending', createdAt: new Date() };
        const result = await db.collection('orders').insertOne(order);
        io.emit('newOrder', { orderId: result.insertedId, order });
        res.status(201).json({ message: 'Order placed successfully', orderId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Error placing order', error: error.message });
    }
});

// ... (other routes with similar validation)


// Get menu items
router.get('/menu', async (req, res) => {
    try {
        const db = getDatabase();
        const menuItems = await db.collection('menu_items').find().toArray();
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching menu items', error: error.message });
    }
});

// Place order
router.post('/place-order', async (req, res) => {
    try {
        const db = getDatabase();
        const order = { ...req.body, status: 'Pending', createdAt: new Date() };
        const result = await db.collection('orders').insertOne(order);
        res.status(201).json({ message: 'Order placed successfully', orderId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Error placing order', error: error.message });
    }
});

// Update order status
router.put('/update-order-status/:orderId', async (req, res) => {
    try {
        const db = getDatabase();
        const { orderId } = req.params;
        const { status } = req.body;
        const result = await db.collection('orders').updateOne(
            { _id: new ObjectId(orderId) },
            { $set: { status } }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
});

module.exports = router;

router.post('/place-order', async (req, res) => {
    try {
        const db = getDatabase();
        const order = { ...req.body, status: 'Pending', createdAt: new Date() };
        const result = await db.collection('orders').insertOne(order);
        io.emit('newOrder', { orderId: result.insertedId, order });
        res.status(201).json({ message: 'Order placed successfully', orderId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Error placing order', error: error.message });
    }
});

router.put('/update-order-status/:orderId', async (req, res) => {
    try {
        const db = getDatabase();
        const { orderId } = req.params;
        const { status } = req.body;
        const result = await db.collection('orders').updateOne(
            { _id: new ObjectId(orderId) },
            { $set: { status } }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        io.emit('orderStatusUpdate', { orderId, status });
        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
});

module.exports = router;
