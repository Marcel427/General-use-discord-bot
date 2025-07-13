const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { WebhookClient } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Star a message and send it via webhook')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to star')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('stars')
                .setDescription('Number of stars (1-5)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(5)),
    async execute(interaction) {
        const message = interaction.options.getString('message');
        const stars = interaction.options.getInteger('stars');
        const starEmojis = '⭐'.repeat(stars);
        const webhookUrl = 'https://discord.com/api/webhooks/1373657418600550460/uL4bZDTvuCwrI5ElNTYMspnI3ehq_VcrA3IW7aJOcri-42-N2SjqIptJIXEP30jnL8Zt';
        interaction.deferReply();

        const embed = new EmbedBuilder()
            .setColor(c.config.color)
            .setDescription(message)
            .setTimestamp()
            .addFields({ name: 'Stars', value: starEmojis, inline: false })
            .setFooter({
                text: `Starred by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL(),
            });
        try {
            const webhook = new WebhookClient({ url: webhookUrl });
            await webhook.send({
                embeds: [embed],
            });
            await interaction.editReply({ content: 'Message starred and sent via webhook!', ephemeral: true });
        } catch (error) {
            await interaction.editReply({ content: 'Failed to send message via webhook.', ephemeral: true });
        }
    },
};