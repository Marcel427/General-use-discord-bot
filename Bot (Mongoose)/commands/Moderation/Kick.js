const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick someone from your discord server")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option => option.setName("user").setDescription("The person you want to kick").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("The reason for the kick"))
    .setDMPermission(false),

    async execute(interaction, c) {
        const { options, channel } = interaction;

        const user = options.getUser("user");
        const reason = options.getString("reason") || "No reason given";

        async function sendMessage(message) {
            const embed = new EmbedBuilder()
            .setColor(c.config.color)
            .setDescription(message)

            interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral})
        }

        const member = await interaction.guild.members.fetch(user.id)

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
        return sendMessage(`⚠️ You can't kick **${member}**, because they have a higher role`);

        await member.kick()

        await sendMessage(`🌍 ${user} was kicked by ${interaction.user} for reason: \n\`${reason}\``)

    }
}