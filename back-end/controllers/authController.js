const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path');
const jwt = require('jsonwebtoken');
const usersFilePath = path.join(__dirname, '../data/users.json');
const secretKey = 'your_jwt_secret_key';

const login = (req, res) => {
    const { username, password } = req.body;
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading users data');
        }
        const users = JSON.parse(data);
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).send('Invalid credentials');
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (!isMatch) {
                return res.status(401).send('Invalid credentials');
            }
            const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            res.send({ message: 'Login successful' });
        });
    });
};

const getProfile = (req, res) => {
    const userId = req.user.id;
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading users data');
        }
        const users = JSON.parse(data);
        const user = users.find(u => u.id === userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json({ email: user.email, role: user.role });
    });
};

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        req.user = user;
        next();
    });
};

const checkAuth = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ loggedIn: false });
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.json({ loggedIn: false });
        }
        res.json({ loggedIn: true, role: user.role });
    });
};

const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.send({ message: 'Logout successful' });
};

module.exports = {
    login,
    getProfile,
    authenticateJWT,
    checkAuth,
    logout
};