const { SlashCommandBuilder } = require("discord.js");
const sendMsg = require("../../functions/sendMsg");

const responses = [
    "It is certain.",
    "Without a doubt.",
    "You may rely on it.",
    "Yes, definitely.",
    "It is decidedly so.",
    "As I see it, yes.",
    "Most likely.",
    "Yes.",
    "Outlook good.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
];

module.exports = {
    data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Ask the magic 8ball a question.")
    .addStringOption(option =>
        option.setName("question")
            .setDescription("The question you want to ask the magic 8ball")
            .setRequired(true)
    ),

    async execute(interaction) {
        const question = interaction.options.getString("question");
        if (!question) {
            sendMsg("Please ask a question", interaction);
        }
        const response = responses[Math.floor(Math.random() * responses.length)];
        sendMsg(`🎱 ${response}`, interaction);
    }
};