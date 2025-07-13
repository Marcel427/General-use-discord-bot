const { SlashCommandBuilder } = require('discord.js');
const sendMsg = require('../../functions/sendMsg');

const compliments = [
    "You're an awesome friend!",
    "You have a great sense of humor!",
    "Your positivity is infectious.",
    "You light up the room.",
    "You're a true gift to the people in your life.",
    "You're a smart cookie!",
    "You are making a difference.",
    "You bring out the best in other people."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('compliment')
        .setDescription('Send a random compliment to a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to compliment')
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const compliment = compliments[Math.floor(Math.random() * compliments.length)];
        await sendMsg(`${user}, ${compliment}`, interaction);
    },
};