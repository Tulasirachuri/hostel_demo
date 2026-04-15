const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ msg: 'No token' });

        const decoded = jwt.verify(token, 'your_jwt_secret');
        const [rows] = await mysql.createConnection({
            host: 'localhost', user: 'root', password: '', database: 'hostel'
        }).execute('SELECT * FROM students WHERE id = ?', [decoded.id]);

        req.student = rows[0];
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Invalid token' });
    }
};
