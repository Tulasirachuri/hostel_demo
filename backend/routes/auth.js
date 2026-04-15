const express = require('express');
const mysql = require('mysql2/promise');
const { hashPassword, comparePassword, generateToken } = require('../models/auth');
const router = express.Router();

const db = require('../config/db');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, roll_no, semester, year, password } = req.body;
        const hashed = await hashPassword(password);

        await db.execute(
            'INSERT INTO students (name, email, roll_no, semester, year, password) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, roll_no, semester, year, hashed]
        );

        res.json({ msg: 'Student registered successfully' });
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await db.execute('SELECT * FROM students WHERE email = ?', [email]);
        const student = rows[0];

        if (!student || !await comparePassword(password, student.password)) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = generateToken(student.id);
        res.json({ token, student: { id: student.id, name: student.name, email: student.email } });
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

module.exports = router;
