const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Fetch a users avatar from this guild")
    .addUserOption(
        option => option
        .setName("user")
        .setDescription("User to fetch the avatar from")
        .setRequired(true)
    )
    .setDMPermission(false),

    async execute(interaction, c) {
        const { options } = interaction;
        let user = options.getUser("user");
        let userAvatar = user.displayAvatarURL({ size: 512 });

        const embed = new EmbedBuilder()
        .setColor(c.config.color)
        .setTitle(`${user.username}'s avatar`)
        .setImage(`${userAvatar}`)
        .setTimestamp()
        .setFooter({ text: `Send by ${c.user.username}` })

        const button = new ButtonBuilder()
        .setLabel("Avatar Link")
        .setStyle(ButtonStyle.Link)
        .setURL(`${user.displayAvatarURL({ size: 512 })}`)

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({
            embeds: [embed],
            components: [row]
        })
    }
}