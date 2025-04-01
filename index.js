import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));
db.once('open', () => console.log('✅connected to MongoDB'));

const ScheduleSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'denied'], default: 'pending' },
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);

// API 라우트 설정
app.get('/home', (req, res) => {
    res.send('메인페이지');
});

app.get('/user', (req, res) => {
    res.send('마이페이지 정보 조회');
});

app.post('/message', (req, res) => {
    res.send('메시지 전송: 오늘이야');
});

app.post('/schedule', async (req, res) => {
    try {
        const schedule = new Schedule(req.body);
        await schedule.save();
        res.status(201).json(schedule);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/schedule/accepted', async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndUpdate(req.body.id, { status: 'accepted' }, { new: true });
        res.json(schedule);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/schedule/denied', async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndUpdate(req.body.id, { status: 'denied' }, { new: true });
        res.json(schedule);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 서버 실행
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
