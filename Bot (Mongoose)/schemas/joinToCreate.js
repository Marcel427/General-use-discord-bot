const { Schema, model } = require("mongoose");

const jtc = new Schema({
    Guild: String,
    Channel: String,
    ChannelName: String,
})

module.exports = model("jtc", jtc);