const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../data/users.json');

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
        res.send({ email: user.email, role: user.role });
    });
};

module.exports = {
    getProfile
};