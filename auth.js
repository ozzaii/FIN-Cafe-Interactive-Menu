// auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getDatabase } = require('./database');

const SECRET_KEY = 'your_secret_key_here';

async function registerStaff(username, password) {
    const db = getDatabase();
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('staff').insertOne({ username, password: hashedPassword });
}

async function loginStaff(username, password) {
    const db = getDatabase();
    const staff = await db.collection('staff').findOne({ username });
    if (!staff) {
        throw new Error('Staff not found');
    }
    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }
    const token = jwt.sign({ username: staff.username }, SECRET_KEY, { expiresIn: '1h' });
    return token;
}

function authenticateStaff(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.staff = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = { registerStaff, loginStaff, authenticateStaff };
