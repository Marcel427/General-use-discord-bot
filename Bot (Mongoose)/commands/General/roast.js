const { SlashCommandBuilder } = require('discord.js');
const sendMsg = require('../../functions/sendMsg');

const roasts = [
    "I'd agree with you but then we'd both be wrong.",
    "If I wanted to kill myself, I'd climb your ego and jump to your IQ.",
    "You're as useless as the 'ueue' in 'queue'.",
    "Light travels faster than sound, which is why you seemed bright until you spoke.",
    "I'd explain it to you, but I don't have any crayons."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roast')
        .setDescription('Roast a user')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to roast')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        const roast = roasts[Math.floor(Math.random() * roasts.length)];
        await sendMsg(`${user}, ${roast}`, interaction);
    },
};