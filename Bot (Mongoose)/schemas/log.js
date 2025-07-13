const { Schema, model } = require("mongoose");

const log = new Schema({
    Guild: String,
    JoinLeaveChannel: String,
    MsgChannel: String,
    RoleChannel: String,
    ChannelChannel: String,
    TicketChannel: String,
    AntiRiadeChannel: String,
})

module.exports = model("log", log);