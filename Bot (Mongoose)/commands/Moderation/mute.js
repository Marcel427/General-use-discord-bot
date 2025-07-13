const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a user")
    .addUserOption(option => option.setName("user").setDescription("The user to be muted").setRequired(true))
    .addStringOption(option => option.setName("duration").setDescription("The time the user should be muted").setRequired(true).addChoices(
        {name: "60 Seconds", value: "60"},
        {name: "2 Minutes", value: "120"},    
        {name: "5 Minutes", value: "300"} ,
        {name: "10 Minutes", value: "600"},
        {name: "15 Minutes", value: "900"},
        {name: "20 Minutes", value: "1200"},
        {name: "30 Minutes", value: "1800"},
        {name: "45 Minutes", value: "2700"},
        {name: "1 Hour", value: "3600"},
        {name: "2 Hours", value: "7200"},
        {name: "3 Hours", value: "10800"},
        {name: "10 Hours", value: "36000"},
        {name: "1 Day", value: "86400"},
        {name: "2 Day", value: "172800"},
        {name: "3 Day", value: "259200"},
        {name: "5 Day", value: "432000"},
        {name: "1 Week", value: "604800"},
    ))
    .addStringOption(option => option.setName("reason").setDescription("The reason for the mute"))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

    async execute(interaction, c) {

        const user = interaction.options.getUser("user")
        const userId = await interaction.guild.members.fetch(user.id)
        const duration = interaction.options.getString("duration")
        const reason = interaction.options.getString("reason") || "No reason given"

        async function sendMessage(message) {
            const embed = new EmbedBuilder()
            .setColor(c.config.color)
            .setDescription(message)

            interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
        }

        await userId.timeout(duration * 1000, reason);

        await sendMessage(`🌍 ${user} was timed out by ${interaction.user} for ${duration / 60} minutes for: \n\`${reason}\``)


    }
}