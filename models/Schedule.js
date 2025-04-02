const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'denied'], default: 'pending' },
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
