const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../data/users.json');

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
            req.session.user = { id: user.id, role: user.role };
            res.send({ message: 'Login successful', role: user.role, id: user.id });
        });
    });
};

const getProfile = (req, res) => {
    const userId = parseInt(req.params.id, 10);
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading users data');
        }
        const users = JSON.parse(data);
        const user = users.find(u => u.id === userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    });
};

module.exports = {
    login,
    getProfile
};