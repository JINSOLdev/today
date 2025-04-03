const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
    {
        title: { type: String, default: '오늘이야', immutable: true }, // 오늘이야 고정
        datetime: { type: Date, required: true },
        location: { type: String, required: true },
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }], // 생성자가 기본 참여자
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
