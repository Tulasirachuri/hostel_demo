const express = require('express');
const mysql = require('mysql2/promise');
const auth = require('../middleware/auth');
const router = express.Router();

const db = require('../config/db');

router.get('/menu', auth, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const [rows] = await db.execute('SELECT * FROM mess_menu WHERE date = ?', [today]);
        res.json(rows[0] || null);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.get('/attendance', auth, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const [rows] = await db.execute('SELECT present FROM mess_attendance WHERE student_id = ? AND date = ?', [req.student.id, today]);
        res.json({ present: rows[0]?.present || false });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.post('/attendance', auth, async (req, res) => {
    try {
        const { present } = req.body;
        const today = new Date().toISOString().split('T')[0];
        
        const [existing] = await db.execute('SELECT id FROM mess_attendance WHERE student_id = ? AND date = ?', [req.student.id, today]);
        
        if (existing.length > 0) {
            await db.execute('UPDATE mess_attendance SET present = ? WHERE id = ?', [present, existing[0].id]);
        } else {
            await db.execute('INSERT INTO mess_attendance (student_id, date, present) VALUES (?, ?, ?)', [req.student.id, today, present]);
        }
        res.json({ msg: 'Attendance updated' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
