const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Express 앱 초기화
const app = express();
connectDB(); // MongoDB 연결

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우트 연결
app.use('/', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ 서버 실행 중: http://localhost:${PORT}`));
// aaa