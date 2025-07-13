const { Schema, model } = require("mongoose");

const userAccount = new Schema({
    userId: { type: String, unique: true, requierd: true },
    userName: { type: String },
    balance: { type: Number}
});

module.exports = model("User", userAccount);