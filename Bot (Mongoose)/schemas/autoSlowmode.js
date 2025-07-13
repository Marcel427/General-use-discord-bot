const mongoose = require('mongoose');

const autoSlowmodeSchema = new mongoose.Schema({
    channelId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    minSlowmode: {
        type: Number,
        required: true,
    },
    maxSlowmode: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('AutoSlowmode', autoSlowmodeSchema);