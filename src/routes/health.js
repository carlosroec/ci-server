const express = require('express');

const router = express.Router();

const check = async (req, res) => {
    try {
        res.json({
            status: 'active'
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            error: err
        });
    }
}

router.get('/health', check);

module.exports = router;
