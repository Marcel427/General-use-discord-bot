const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags, ChannelType, PermissionsBitField } = require("discord.js");
const log = require("../../schemas/log");

module.exports = {
    data: new SlashCommandBuilder()
       .setName("log")
       .setDescription("manage the log system")
       .addSubcommand(subcommand => subcommand
        .setName("setup")
        .setDescription("setup the log system")
        .addChannelOption(option => option
            .setName("join-leave-log")
            .setDescription("logs when users join and leave the server")
            .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option => option
            .setName("message-log")
            .setDescription("logs messages deleted in channels")
            .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option => option
            .setName("role-log")
            .setDescription("logs when roles are added, removed, or edited")
            .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option => option
            .setName("channel-log")
            .setDescription("logs when channels are added, removed, or edited")
            .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option => option
            .setName("ticket-log")
            .setDescription("logs when tickets are opend or closed")
            .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option => option
            .setName("anti-raid-log")
            .setDescription("logs when the anti-raid system is triggered")
            .addChannelTypes(ChannelType.GuildText)
        )
       )
       .addSubcommand(subcommand => subcommand
        .setName("disable")
        .setDescription("disables a the log system")
       )
       .addSubcommand(subcommand => subcommand
        .setName("quick-setup")
        .setDescription("This will create a category and log channels for you with the right permissions")
       )
       .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

       async execute(interaction, c) {
            const sub = interaction.options.getSubcommand();

            async function sendMessage(message) {
                const embed = new EmbedBuilder()
                .setColor(c.config.color)
                .setDescription(message)

                interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
            };

            async function createChannel(name, emoji, categoryId) {
                const channel = await interaction.guild.channels.create({
                    name: `${emoji + "┃" || ""}${name}`,
                    type: ChannelType.GuildText,
                    parent: categoryId,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        },
                        {
                            id: c.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels]
                        },
                    ]
                });

                return channel;
            }

            const data = await log.findOne({ Guild: interaction.guild.id });

            switch (sub) {
                case "setup": 
                    const joinLeaveLog = interaction.options.getChannel("join-leave-log")||" ";
                    const messageLog = interaction.options.getChannel("message-log")||" ";
                    const roleLog = interaction.options.getChannel("role-log") || " ";
                    const channelLog = interaction.options.getChannel("channel-log")|| " ";
                    const ticketLog = interaction.options.getChannel("ticket-log") || " ";
                    const antiRaidLog = interaction.options.getChannel("anti-raid-log") || " ";

                    if (!data) {
                        await log.create({
                            Guild: interaction.guild.id,
                            JoinLeaveChannel: joinLeaveLog.id,
                            MsgChannel: messageLog.id,
                            RoleChannel: roleLog.id,
                            ChannelChannel: channelLog.id,
                            TicketChannel: ticketLog.id,
                            AntiRiadeChannel: antiRaidLog.id
                        });

                        await sendMessage("🌍 Log system has been setup");
                    } else {
                        await log.findOneAndUpdate({
                            Guild: interaction.guild.id,
                            JoinLeaveChannel: joinLeaveLog.id,
                            MsgChannel: messageLog.id,
                            RoleChannel: roleLog.id,
                            ChannelChannel: channelLog.id,
                            TicketChannel: ticketLog.id,
                            AntiRiadeChannel: antiRaidLog.id
                        });

                        await sendMessage("🌍 Log system has been updated");
                    }
                break;

                case "disable": 
                    await log.deleteOne({ Guild: interaction.guild.id });

                    await sendMessage("🌍 Log system has been disabled");
                break;

                case "quick-setup":
                    await interaction.deferReply({ flags: MessageFlags.Ephemeral }) 
                    if (!data) {
                        let category = await interaction.guild.channels.create({
                            name: `💾┃Logs`,
                            type: ChannelType.GuildCategory,
                            permissionOverwrites: [
                                {
                                    id: interaction.guild.roles.everyone,
                                    deny: [PermissionsBitField.Flags.ViewChannel]
                                },
                                {
                                    id: c.user.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels]
                                },
                            ]
                        });

                        const JoinLeaveLog = await createChannel("Join/Leave-Log", "👋", category.id);
                        const MsgLog = await createChannel("Message-Log", "✍️", category.id);
                        const RoleLog = await createChannel("Role-Log", "📧", category.id)
                        const ChannelLog = await createChannel("Channel-log", "📋", category.id)
                        const TicketLog = await createChannel("Ticket-Log", "🎫", category.id)
                        const AntiRaidLog = await createChannel("Anti-Raid-Log", "🚨", category.id)

                        await log.create({
                            Guild: interaction.guild.id,
                            JoinLeaveChannel: JoinLeaveLog.id,
                            MsgChannel: MsgLog.id,
                            RoleChannel: RoleLog.id,
                            ChannelChannel: ChannelLog.id,
                            TicketChannel: TicketLog.id,
                            AntiRiadeChannel: AntiRaidLog.id
                        });

                        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(c.config.color).setDescription("🌍 Quick setup completed")]});
                    } else {
                        return await interaction.editReply({ embeds: [new EmbedBuilder().setColor(c.config.color).setDescription("⚠️ The log system is already enabled")]});
                    }
                break;
            }
    }
}