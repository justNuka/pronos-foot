const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/predictions.json');

const getPredictions = (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading predictions data');
        }
        const predictions = JSON.parse(data);
        res.send(predictions);
    });
};

const addPrediction = (req, res) => {
    const newPrediction = req.body;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading predictions data');
        }
        const predictions = JSON.parse(data);
        predictions.push(newPrediction);
        fs.writeFile(filePath, JSON.stringify(predictions), (err) => {
            if (err) {
                return res.status(500).send('Error writing predictions data');
            }
            res.status(201).send(newPrediction);
        });
    });
};

module.exports = {
    getPredictions,
    addPrediction
};