const express = require('express');
const mysql = require('mysql2/promise');
const auth = require('../middleware/auth');
const router = express.Router();

const db = require('../config/db');

router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM leave_applications WHERE student_id = ? ORDER BY id DESC', [req.student.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { from_date, to_date, reason } = req.body;
        await db.execute(
            'INSERT INTO leave_applications (student_id, from_date, to_date, reason) VALUES (?, ?, ?, ?)',
            [req.student.id, from_date, to_date, reason]
        );
        res.json({ msg: 'Leave application submitted' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
