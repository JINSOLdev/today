const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/User');

require('dotenv').config();

// 회원가입 API
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 이메일 중복 확인
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: '이미 가입된 이메일 입니다.' });

        // 유저 생성 후 저장
        user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ message: '회원가입 성공!' });
    } catch (err) {
        res.status(500).json({ err: err });
    }
});

// 로그인 API
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 유저 확인
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: '이메일 또는 비밀번호가 잘못되었습니다.' });

        // 비밀번호 확인
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: '이메일 또는 비밀번호가 잘못되었습니다' });

        // JWT 토큰 생성
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // res.json({ message: '로그인 성공', token });
        res.setHeader('Authorization', `Bearer ${token}`);
        res.status(200).json({ message: '로그인 성공!' });
    } catch (err) {
        res.status(500).json({ error: '서버 오류' });
    }
});

module.exports = router;
