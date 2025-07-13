const { SlashCommandBuilder } = require('discord.js');
const sendMsg = require('../../functions/sendMsg');

const dares = [
    "Do 10 jumping jacks.",
    "Send a funny selfie in the chat.",
    "Speak in an accent for the next 5 minutes.",
    "Post the last photo you took.",
    "Imitate another server member until someone guesses who it is.",
    "Type your next message with your nose.",
    "Change your nickname to something silly for 10 minutes.",
    "Sing the chorus of your favorite song in voice chat.",
    "Let someone else pick your profile picture for an hour.",
    "Tell a joke, even if it's bad."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dare')
        .setDescription('Get a random dare for Truth or Dare!'),
    async execute(interaction) {
        const dare = dares[Math.floor(Math.random() * dares.length)];
        await sendMsg(`🤪 **Dare:** ${dare}`, interaction);
    },
};