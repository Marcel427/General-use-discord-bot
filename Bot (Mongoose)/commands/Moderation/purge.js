const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purges a channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

    async execute(interaction, c) {
        const channel = interaction.channel;
        const user = interaction.user.username;

        async function sendMessage(message) {
            const embed = new EmbedBuilder()
            .setColor(c.config.color)
            .setDescription(message)

            interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
        }

        await channel.bulkDelete(99, true)

        await sendMessage(`🌍 Channel purge completed`)
    }
}