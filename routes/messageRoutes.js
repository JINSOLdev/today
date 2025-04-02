const express = require('express');
const router = express.Router();

// 메시지 전송 (실제로 메시지 내용을 저장하지 않음)
router.post('/message', (req, res) => {
    res.json({ message: '오늘이야' });
});

module.exports = router;
