const express = require('express');
const Event = require('../models/Event');
const authMiddleware = require('../middleware/authMiddleware'); // JWT 인증

const router = express.Router();

// 약속 생성 API
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { datetime, location, invitees = [] } = req.body;
        const userId = req.user?.userId; // JWT에서 가져온 유저 아이디

        // userId 없을 경우 에러 반환
        if (!userId) {
            return res.status(401).json({ message: '인증된 사용자만 약속을 생성할 수 있습니다.' });
        }

        // 필수 데이터 확인
        if (!datetime || !location) {
            return res.status(400).json({ message: '날짜와 위치를 입력해주세요요.' });
        }

        // 초대인원 유효성 검사
        if (!Array.isArray(invitees)) {
            return res.status(400).json({ message: ' 초대 대상은 배열로 전달되어야 합니다.' });
        }

        if (invitees.length > 3) {
            return res.status(400).json({ message: '초대는 최대 3명까지만 가능합니다.' });
        }

        // 본인은 무조건 accepted 상태로 포함
        const participants = [{ user: userId, status: 'accepted' }, ...(invitees || []).map((id) => ({ user: id, status: 'pending' }))];

        // 새 약속 생성
        const newEvent = new Event({
            title: '오늘이야',
            datetime,
            location,
            participants,
            createdBy: userId,
        });

        await newEvent.save();

        res.status(201).json({ message: '약속이 생성되었습니다.', eventId: newEvent._id });
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 내가 만든 약속 조회
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

// 초대받은 약속 조회
router.get('/my-events/invited', authMiddleware, async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ message: 'userId가 필요합니다.' });

    try {
        const invitedEvents = await Event.find({
            'participants.user': userId,
            createdBy: { $ne: userId }, // 내가 만든 약속은 제외
        }).sort({ datetime: -1 });
        res.json(invitedEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 내가 수락한 약속 조회
router.get('/my-events/accepted', authMiddleware, async (req, res) => {
    const userId = req.user?.userId;
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

// 약속에 대한 수락/거절 응답
router.post('/:eventId/respond', authMiddleware, async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user?.userId;
    const { status } = req.body; // 'accepted' or 'declined'

    if (!['accepted', 'declined'].includes(status)) {
        return res.status(400).json({ message: 'status는 accepted 또는 declined여야 합니다.' });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event를 찾을 수 없습니다.' });

        // 참여자 응답 상태 업데이트 (기존 응답 수정 or 새로 추가)
        const participantIndex = event.participants.findIndex((p) => p.user.toString() === userId);

        if (participantIndex > -1) {
            event.participants[participantIndex].status = status;
        } else {
            event.participants.push({ user: userId, status });
        }

        await event.save();
        res.json({ message: '응답이 저장되었습니다.', event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
