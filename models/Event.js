const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
    {
        title: { type: String, default: '오늘이야', immutable: true }, // 오늘이야 고정
        datetime: { type: Date, required: true },
        location: { type: String, required: true },
        participants: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                status: { type: String, enum: ['pending', 'accepted', 'declined'], default:'pending'}
            }
        ], // 참여자의 응답 상태 추가
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
