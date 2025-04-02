const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/user', async (req, res) => {
    try {
        const users = await User.find();
        // res.json(users);
        res.send('마이페이지 정보 조회');
    } catch (err) {
        res.status(500).json({ error: '서버 오류' });
    }
});

module.exports = router;
