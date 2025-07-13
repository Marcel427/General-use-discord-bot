const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField, PermissionFlagsBits, MessageFlags} = require("discord.js");
const memberCount = require("../../schemas/memberCount");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("member-count")
    .setDescription("Manage the Member-count system")
    .addSubcommand(subcommand => subcommand.setName("setup").setDescription("Setup the Member-count system")
        .addChannelOption(options => options.setName("channel").setDescription("Select a channel to show as member-count").addChannelTypes(ChannelType.GuildVoice).setRequired(true))
        .addStringOption(options => options.setName("channel-name").setDescription("The name of the channel (use !count at the count location)").setRequired(false).setMaxLength(1000))
    )
    .addSubcommand(subcommand => subcommand.setName("disable").setDescription("Disable the member-count system"))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, c) {
        async function sendMessage(message) {
            const embed = new EmbedBuilder()
            .setColor(c.config.color)
            .setDescription(message)

            interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
        }

        const data = await memberCount.findOne({ Guild: interaction.guild.id })
        const sub = interaction.options.getSubcommand()

        switch (sub) {
            case "setup":
                const channel = interaction.options.getChannel("channel")
                const channelName = interaction.options.getString("channel-name") || `» All Members: !count}`

                if (data) {
                    return sendMessage("⚠️ The member-count system is already setup for this server.")
                }

                await memberCount.create({ Guild: interaction.guild.id, Channel: channel.id, ChannelName: channelName })
                await sendMessage(`🌍 The member-count system has been setup for <#${channel.id}>.`)
                // change to make a custom name
                const mc = interaction.guild.memberCount;
                await channel.setName(channelName.replace("!count", mc))
            break

            case "disable":
                if (!data) {
                    return sendMessage("⚠️ The member-count system is not setup for this server.")
                }

                await memberCount.deleteOne({ Guild: interaction.guild.id })
                await sendMessage("🌍 The member-count system has been disabled for this server.")
            break
        }
    }
}