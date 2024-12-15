const express = require('express');
const router = express.Router();
const Cemetery = require('../models/Cemetery');

// Получение всех кладбищ
router.get('/', async (req, res) => {
    try {
        const cemeteries = await Cemetery.find();
        res.json(cemeteries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Создание нового кладбища
router.post('/', async (req, res) => {
    const cemetery = new Cemetery({
        name: req.body.name,
        address: req.body.address,
        coordinates: req.body.coordinates,
        description: req.body.description
    });

    try {
        const newCemetery = await cemetery.save();
        res.status(201).json(newCemetery);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;