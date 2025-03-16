import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// 서버 실행
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
