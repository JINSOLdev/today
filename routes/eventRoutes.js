const express = require('express');
const Event = require('../models/Event');
const authMiddleware = require('../middleware/authMiddleware'); // JWT 인증

const router = express.Router();

// 약속 생성 API
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { datetime, location } = req.body;
        const userId = req.user?.userId; // JWT에서 가져온 유저 아이디
        // console.log(userId);

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
            participants: [userId], // 생성자를 자동으로 추가가
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
