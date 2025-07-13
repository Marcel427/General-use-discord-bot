const { Schema, model } = require("mongoose");

const note = new Schema({
    header: String,
    content: String,
    user: String,
    id: String,
})

module.exports = model("note", note);