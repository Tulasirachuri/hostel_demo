const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/mess', require('./routes/mess'));
app.use('/api/bills', require('./routes/bills'));
app.use('/api/leave', require('./routes/leave'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/dashboard', require('./routes/dashboard'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
