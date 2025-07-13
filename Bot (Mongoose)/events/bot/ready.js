const { connect, mongoose, } = require("mongoose")
const { ActivityType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebhookClient } = require("discord.js")
const Giveaway = require('../../schemas/giveaway');
const { getLogs } = require("../../functions/logger");

module.exports = {
    name: "ready",
    once: true,

    async execute(c) {
        console.log(`[INFO] ${c.user.username} online`);
        // Connect to MongoDB
        await connect(c.config.db)
        console.log("[INFO] Database online\n");
        console.log(`<-------------------------------------------------------------------->`);

        if (c.config.consoleReady === true) console.log(`ready\n`) 
        
        const status = "/help | Cordinal Service";
        c.user.setActivity(status, {
        	type: ActivityType.Custom
        })
    }
}
