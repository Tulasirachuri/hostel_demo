const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
};

exports.comparePassword = async (password, hashed) => {
    return bcrypt.compare(password, hashed);
};

exports.generateToken = (id) => {
    return jwt.sign({ id }, 'your_jwt_secret', { expiresIn: '7d' });
};
