const { Schema, model } = require("mongoose");

const embed = new Schema({
    Guild: String,
    Channel: String,
    Msg: String,
    id: String
})

module.exports = model("embed", embed);