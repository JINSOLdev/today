const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('🔍 Decoded JWT:', decoded);
        req.user = decoded;

        if (!req.user?.userId) {
            return res.status(401).json({ message: '유효하지 않은 사용자 정보 입니다.' });
        }
        next();
    } catch (error) {
        console.log('JWT 인증 오류:', error);
        return res.status(401).json({ message: '유효하지 않은 토큰 입니다.' });
    }
};

module.exports = authMiddleware;
