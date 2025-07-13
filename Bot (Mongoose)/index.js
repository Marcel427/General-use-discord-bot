const { Client, IntentsBitField, Collection } = require("discord.js");
const { getLogs } = require('./functions/logger');
const c = new Client({
    intents:[
        IntentsBitField.Flags.AutoModerationConfiguration,
        IntentsBitField.Flags.AutoModerationExecution,
        IntentsBitField.Flags.DirectMessageReactions,
        IntentsBitField.Flags.DirectMessageTyping,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildExpressions,
        IntentsBitField.Flags.GuildIntegrations,
        IntentsBitField.Flags.GuildInvites,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildMessageTyping,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildModeration,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildScheduledEvents,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildWebhooks,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.MessageContent
    ]
});

c.commands = new Collection();

const { loadEvents } = require("./handler/eventHandler");
const { loadCommands } = require("./handler/commandHandler")

c.config = require("./config.json");

module.exports = { c };

c.login(c.config.token)
    .then(
    	console.log("<------------------------------ Info ------------------------------->\n"),
        loadEvents(c),
        loadCommands(c),
    );

const process = require("node:process");

process.on("unhandledRejection", async(reason, promise) => {
    console.error("Unhandled rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
    console.log("Uncaught exception:", err);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log("Uncaught exception monitor", err, origin);
});