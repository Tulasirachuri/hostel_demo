const express = require('express');
const mysql = require('mysql2/promise');
const auth = require('../middleware/auth');
const router = express.Router();

const db = require('../config/db');

// Get all rooms with status
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT r.*, 
                   CASE 
                       WHEN r.occupied = 0 THEN 'available'
                       WHEN r.occupied = r.capacity THEN 'occupied' 
                       ELSE 'partial'
                   END as status
            FROM rooms r
        `);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Choose room
router.post('/choose', auth, async (req, res) => {
    try {
        const { roomId } = req.body;
        
        // Update room occupancy
        await db.execute('UPDATE rooms SET occupied = occupied + 1 WHERE id = ?', [roomId]);
        // Assign room to student
        await db.execute('UPDATE students SET room_id = ? WHERE id = ?', [roomId, req.student.id]);

        res.json({ msg: 'Room assigned successfully' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
