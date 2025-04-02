const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        datetime: { type: Date, required: true },
        location: { type: String, required: true },
        participants: [{ type: String, required: true }],
        // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
