const { Schema, model } = require("mongoose");

const ticketChannel = new Schema({
    Guild: String,
    Channel: String,
    Msg: String,
    User: String,
});

module.exports = model("TicketChannel", ticketChannel);