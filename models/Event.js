const mongoose = require('mongoose');

const MAX_PARTICIPANTS = 4;

const EventSchema = new mongoose.Schema(
    {
        title: { type: String, default: '오늘이야', immutable: true }, // 오늘이야 고정
        datetime: { type: Date, required: true },
        location: { type: String, required: true },
        participants: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
            },
        ], // 참여자의 응답 상태 추가
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

// 참가자수 제한 (최대 4명까지)
EventSchema.path('participants').validate(function (value) {
    return value.length <= MAX_PARTICIPANTS;
}, '참가자는 최대 3명까지만 초대할 수 있습니다. (자기 자신 포함 최대 4명)');

module.exports = mongoose.model('Event', EventSchema);
