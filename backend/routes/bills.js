const express = require('express');
const mysql = require('mysql2/promise');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

const db = require('../config/db');

router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM mess_bills WHERE student_id = ? ORDER BY id DESC', [req.student.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.post('/pay', auth, upload.single('receipt'), async (req, res) => {
    try {
        const { billId } = req.body;
        const receiptPath = req.file ? `/uploads/receipts/${req.file.filename}` : null;
        
        await db.execute(
            'UPDATE mess_bills SET status = ?, receipt_url = ? WHERE id = ? AND student_id = ?', 
            ['paid', receiptPath, billId, req.student.id]
        );
        res.json({ msg: 'Payment submitted for verification' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
