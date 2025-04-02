const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');

// 약속 생성
router.post('/schedule', async (req, res) => {
    try {
        const { sender, receiver, date, location } = req.body;
        const newSchedule = new Schedule({ sender, receiver, date, location });
        await newSchedule.save();
        res.status(201).json(newSchedule);
    } catch (err) {
        res.status(400).json({ error: '잘못된 요청' });
    }
});

// 약속 수락
router.post('/schedule/accepted', async (req, res) => {
    try {
        const { scheduleId } = req.body;
        const updatedSchedule = await Schedule.findByIdAndUpdate(scheduleId, { status: 'accepted' }, { new: true });
        res.json(updatedSchedule);
    } catch (err) {
        res.status(500).json({ error: '서버 오류' });
    }
});

// 약속 거절
router.post('/schedule/denied', async (req, res) => {
    try {
        const { scheduleId } = req.body;
        const updatedSchedule = await Schedule.findByIdAndUpdate(scheduleId, { status: 'denied' }, { new: true });
    } catch (err) {
        res.status(500).json({ error: '서버 오류' });
    }
});

module.exports = router;