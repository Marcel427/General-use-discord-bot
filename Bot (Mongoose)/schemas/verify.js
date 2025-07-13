const { Schema, model } = require("mongoose");

const verify = new Schema({
    guild: String,
    channel: String,
    role: String,
    msg: String,
});

module.exports = model("verify", verify);