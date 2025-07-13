const { model, Schema } = require("mongoose");

const cooldown = new Schema({
    userId: String,
    cooldownExpiration: Number
});

module.exports = model("cooldown", cooldown);