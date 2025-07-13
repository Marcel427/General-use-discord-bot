const { SlashCommandBuilder } = require('discord.js');
const sendMsg = require('../../functions/sendMsg');

const truths = [
    "What's your biggest fear?",
    "What's a secret you've never told anyone?",
    "Who was your first crush?",
    "What's the most embarrassing thing you've ever done?",
    "Have you ever lied to your best friend?",
    "What's something you're glad your family doesn't know about you?",
    "What's the last thing you searched for on your phone?",
    "What's a guilty pleasure you have?",
    "Have you ever cheated on a test?",
    "What's the weirdest dream you've ever had?"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('truth')
        .setDescription('Get a random truth question for Truth or Dare!'),
        
    async execute(interaction) {
        const randomTruth = truths[Math.floor(Math.random() * truths.length)];
        await sendMsg(`${randomTruth}`, interaction);
    },
};