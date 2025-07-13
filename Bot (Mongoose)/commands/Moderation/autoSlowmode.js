const { SlashCommandBuilder, EmbedBuilder, MessageFlags, PermissionFlagsBits } = require("discord.js");
const autoSlowmodeSchema = require("../../schemas/autoSlowmode");


module.exports = {
    data: new SlashCommandBuilder()
    .setName("auto-slowmode")
    .setDescription("Auto slowmode make channel moderation easier")
    .addSubcommand(subcommand => subcommand
        .setName("setup")
        .setDescription("Setup auto slowmode")
        .addChannelOption(option => option.setName("channel").setDescription("Channel for auto slowmode").setRequired(true))
        .addIntegerOption(option => option.setName("min-slowmode").setDescription("Minimum of seconds for auto slowmode").setRequired(true))
        .addIntegerOption(option => option.setName("max-slowmode").setDescription("Maximum of seconds for auto slowmode").setRequired(true))
    )
    .addSubcommand(subcommand => subcommand
        .setName("disable")
        .setDescription("disable the auto slowmode system")
    )
    .addSubcommand(subcommand => subcommand
        .setName("info")
        .setDescription("Get ssome info about the aauto slowmode system")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, c) {
        async function sendMsg(msg) {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(msg)
                    .setColor(c.config.color)
                ]
            })
        }
        const data = await autoSlowmodeSchema.findOne({ guildId: interaction.guild.id });
        const { guild, options } = interaction;
        const sub = options.getSubcommand();
        await interaction.deferReply({ ephemeral: true });

        switch(sub) {
            case "setup":
                const channel = options.getChannel("channel");
                const minSlowmode = options.getInteger("min-slowmode");
                const maxSlowmode = options.getInteger("max-slowmode");
                if (minSlowmode > maxSlowmode) return sendMsg("⚠️ Minimum slowmode cannot be greater than maximum slowmode")
                if (minSlowmode < 0) return sendMsg("⚠️ Minimum slowmode cannot be less than 0")
                if (maxSlowmode < 3) return sendMsg("⚠️ Maximum slowmode cannot be less than 0")
                if (data) return sendMsg("⚠️ Auto slowmode is already setup in this server, please disable it first")
                const newData = new autoSlowmodeSchema({
                    channelId: channel.id,
                    guildId: guild.id,
                    minSlowmode: minSlowmode,
                    maxSlowmode: maxSlowmode
                });
                await newData.save();
                await channel.setRateLimitPerUser(minSlowmode, `Auto slowmode by ${c.user.username}`);
                await sendMsg(`🌍 Auto slowmode has been setup in <#${channel.id}> with a minimum of ${minSlowmode} seconds and a maximum of ${maxSlowmode} seconds`)
            break;
            case "disable":
                if (!data) return sendMsg("⚠️ is not setup yet");
                const disableChannel = guild.channels.cache.get(data.channelId);
                await disableChannel.setRateLimitPerUser(0, `Auto slowmode disabled by ${c.user.username}`);
                await autoSlowmodeSchema.deleteMany({ guildId: interaction.guild.id });
                return sendMsg("🌍 Auto slowmode has been disabled")
            break;
            case "info":
                let InfoEmbed = new EmbedBuilder()
                .setColor(c.config.color)
                .setTitle("Auto Slowmode Info")
                .setDescription(`Auto slowmode is ${data ? "**enabled**" : "**disabled**"} in this server`)

                if (!data) {
                    InfoEmbed.addFields(
                        {
                            name: "Channel",
                            value: "The channel the slowmodwe should be applied to",
                            inline: true
                        },
                        {
                            name: "Min Slowmode",
                            value: "the minimum slowmode time",
                            inline: true
                        },
                        {
                            name: "Max Slowmode",
                            value: "the maximum slowmode time",
                            inline: true
                        }
                    )

                    await interaction.editReply({ embeds: [InfoEmbed] })
                } else {
                    InfoEmbed.addFields(
                        {
                            name: "Channel",
                            value: `<#${data.channelId}>`,
                            inline: true
                        },
                        {
                            name: "Min Slowmode",
                            value: `${data.minSlowmode} Seconds`,
                            inline: true
                        },
                        {
                            name: "Max Slowmode",
                            value: `${data.maxSlowmode} Seconds`,
                            inline: true
                        }
                    )

                    await interaction.editReply({ embeds: [InfoEmbed] })
                }
            break;
        }
    }
}