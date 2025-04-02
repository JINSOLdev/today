const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 로그인 성공한 유저 정보 조회 (토큰 필요)
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password'); // 비밀번호 제외
        if (!user) return res.status(404).json({ error: '유저를 찾을 수 없습니다.' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: '서버 오류' });
    }
});

module.exports = router;
