const express = require('express');
const Event = require('../models/Event');
const authMiddleware = require('../middleware/authMiddleware'); // JWT 인증

const router = express.Router();

// 약속 생성 API
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, datetime, location, participants } = req.body;
        const userId = req.user.id; // JWT에서 가져온 유저 아이디

        // 필수 데이터 확인
        if (!title || !datetime || !location || !participants.length) {
            return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
        }

        // 새 약속 생성
        const newEvent = new Event({
            title,
            datetime,
            location,
            participants,
            createdBy: userId,
        });

        await newEvent.save();

        res.status(201).json({ message: '약속이 생성되었습니다.', eventId: newEvent._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;
