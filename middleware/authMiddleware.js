const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config()

module.exports = function (req, res, next) {
    const token = req.header('Authorization');

    // 톼큰이 없으면 요청 거부
    if (!token) return res.status(401).json({ error: '토큰이 없습니다. 인증이 필요합니다.' });

    try {
        // "Bearer <token>" 형태이므로 "Bearer" 부분을 제거
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded; // 요청 객체에 user 정보 저장
        next();
    } catch (err) {
        res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    }
};
