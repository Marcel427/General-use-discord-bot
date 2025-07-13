const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban someone from your discord server")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option => option.setName("user").setDescription("The user to ban").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("The reason for the ban"))
    .setDMPermission(false),

    async execute(interaction, c) {
        const { options } = interaction;

        const user = options.getUser("user");
        const reason = options.getString("reason") || "No reason given";

        async function sendMessage(message) {
            const embed = new EmbedBuilder()
            .setColor(c.config.color)
            .setDescription(message)

            interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
        }

        const member = await interaction.guild.members.fetch(user.id)

        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return await sendMessage(`⚠️ You can't ban ${user}, because they have a higher role`)
        } else {
            await member.ban()
            await sendMessage(`🌍 ${user} banned by ${interaction.user} for reason: \n\`${reason}\``)

    }
    }
}