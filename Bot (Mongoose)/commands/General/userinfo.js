const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const warn = require("../../schemas/warn");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get information abbout a user")
    .addUserOption(option =>
        option
        .setName("user")
        .setDescription("Select a user")
        .setRequired(false)
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    async execute(interaction, c) {
        const { options } = interaction;
        const user = options.getUser("user") || interaction.user;
        const member = await interaction.guild.members.cache.get(user.id);
        const icon = user.displayAvatarURL();
        const tag = user.username
        
        let embed = new EmbedBuilder()
        .setAuthor({ name: tag, iconURL: icon })
        .addFields(
            { name: "👤 Name:", value: `${user}`, inline: false },
            { name: "🪪 ID:", value: `\`${user.id}\``, inline: false },
            { name: "🔗 Roles:", value: `${member.roles.cache.map(r => r).join(` `)}`, inline: false },
            { name: "⌚ Joined server:", value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true },
            { name: "⌚ Joined Discord:", value: `<t:${parseInt(member.user.createdAt / 1000)}:R>`, inline: true }
        )
        .setThumbnail(icon)
        .setFooter({ text: `Send by ${c.user.username}` })
        .setTimestamp()
        .setColor(c.config.color)

        await interaction.reply({ embeds: [embed]})            
    }
}
