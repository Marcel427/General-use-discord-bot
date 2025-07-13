const { Schema, model } = require("mongoose")

const memberCount = new Schema({
    Guild: String,
    Channel: String,
    ChannelName: String,
});

module.exports = model("memberCount", memberCount);