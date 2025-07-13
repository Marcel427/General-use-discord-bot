const { Schema, model } = require("mongoose");

const ticket = new Schema({
    channel: String,
    guildId: String
})

module.exports = model("ticket", ticket);