const express = require('express');
const mysql = require('mysql2/promise');
const auth = require('../middleware/auth');
const router = express.Router();

const db = require('../config/db');

// Student Dashboard
router.get('/', auth, async (req, res) => {
    try {
        
        // Student details with room
        const [studentRows] = await db.execute(`
            SELECT s.*, r.room_no 
            FROM students s 
            LEFT JOIN rooms r ON s.room_id = r.id 
            WHERE s.id = ?
        `, [req.student.id]);
        
        // Today's mess attendance
        const today = new Date().toISOString().split('T')[0];
        const [attendanceRows] = await db.execute(`
            SELECT * FROM mess_attendance 
            WHERE student_id = ? AND date = ?
        `, [req.student.id, today]);
        
        // Today's menu
        const [menuRows] = await db.execute(`
            SELECT * FROM mess_menu WHERE date = ?
        `, [today]);
        

        
        // Attendance History for Calendar (last 30 days)
        const [historyRows] = await db.execute(`
            SELECT date, present FROM mess_attendance 
            WHERE student_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            ORDER BY date ASC
        `, [req.student.id]);

        const totalDays = 30;
        const presentDays = historyRows.filter(r => r.present).length;
        const attendancePercentage = Math.round((presentDays / totalDays) * 100);

        res.json({
            student: studentRows[0],
            todayAttendance: attendanceRows[0]?.present || false,
            todayMenu: menuRows[0] || null,
            attendanceHistory: historyRows,
            attendancePercentage
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
