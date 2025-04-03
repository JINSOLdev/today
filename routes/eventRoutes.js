const express = require('express');
const Event = require('../models/Event');
const authMiddleware = require('../middleware/authMiddleware'); // JWT 인증

const router = express.Router();

// 약속 생성 API
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { datetime, location } = req.body;
        const userId = req.user?.userId; // JWT에서 가져온 유저 아이디

        // userId 없을 경우 에러 반환
        if (!userId) {
            return res.status(401).json({ message: '인증된 사용자만 약속을 생성할 수 있습니다.' });
        }

        // 필수 데이터 확인
        if (!datetime || !location) {
            return res.status(400).json({ message: '날짜와 위치를 입력해주세요요.' });
        }

        // 새 약속 생성
        const newEvent = new Event({
            title: '오늘이야',
            datetime,
            location,
            participants: [{ user: userId, status: 'accepted' }],
            createdBy: userId,
        });

        await newEvent.save();

        res.status(201).json({ message: '약속이 생성되었습니다.', eventId: newEvent._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 내가 생성한 약속 조회
router.get('/my-events/created', authMiddleware, async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ message: 'userId가 필요합니다.' });

    try {
        const events = await Event.find({ createdBy: userId }).sort({ datetime: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 내가 수락한 약속 조회
router.get('/my-events/accepted', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId가 필요합니다.' });

    try {
        const events = await Event.find({
            'participants.user': userId,
            'participants.status': 'accepted',
        }).sort({ datetime: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
