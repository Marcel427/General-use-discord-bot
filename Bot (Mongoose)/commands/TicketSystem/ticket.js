const { SlashCommandBuilder,  EmbedBuilder, MessageFlags, PermissionsBitField, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const TicketChannel = require("../../schemas/ticketChannel")
const ticket = require("../../schemas/tickets")
const log = require("../../schemas/log")
const { createTranscript } = require("discord-html-transcripts")

module.exports = {
    data: new SlashCommandBuilder()
       .setName("ticket")
       .setDescription("manage your ticket")
       .addSubcommand(subcommand => subcommand
        .setName("close")
        .setDescription("Closes your ticket")
       )
       .addSubcommand(subcommand => subcommand
        .setName("rename")
        .setDescription("Rename your ticket")
        .addStringOption(option => option.setName("name").setDescription("New name for your ticket").setRequired(true))
       )
       .addSubcommand(subcommand => subcommand
        .setName("add")
        .setDescription("Add a user to your ticket")
        .addUserOption(option => option.setName("user").setDescription("User to add").setRequired(true))
       )
       .addSubcommand(subcommand => subcommand
        .setName("create")
        .setDescription("open a ticket")
       ),
       
    async execute(interaction, c) {
        const { options, guild, channel } = interaction;
        const userTicket = await TicketChannel.findOne({ Guild: guild.id, Channel: channel.id });
        const logData = await log.findOne({ Guild: guild.id, TicketChannel: {$exists: true} });
        const sub = options.getSubcommand();

        async function sendMsg(msg, ephemeral) {
            const msgEmbed = new EmbedBuilder()
               .setColor(c.config.color)
               .setDescription(msg)

            if (ephemeral === "true") {
                await interaction.reply({ embeds: [msgEmbed], flags: MessageFlags.Ephemeral });
            } else if (ephemeral === "false") {
                await interaction.reply({ embeds: [msgEmbed]});
            }
        };

        async function logMessage(message, file) {
            if (!logData) return;
            const channel = guild.channels.cache.get(logData.TicketChannel)

            const logEmbed = new EmbedBuilder()
            .setColor(c.config.color)
            .setDescription(message)

            channel.send({ embeds: [logEmbed], files: [file] })
        };

        switch(sub) {
            case "close":
                if (!userTicket) return sendMsg("⚠️ This is not a ticket", "true")
                const transcript = await createTranscript(channel, {
                    limit: -1,
                    returnBuffer: false,
                    filename: `ticket-${userTicket.User}.html`
                })
    
                if(!logData) {
                    sendMsg(`🌍 Ticket will be closed in 10 seconds`, "false");
                    setTimeout(async() => {
                        await userTicket.deleteOne({ Guild: interaction.guild.id, Channel: interaction.channel.id });
                        await channel.delete()
                    }, 10000);
                } else {
                    sendMsg(`🌍 Ticket will be closed in 10 seconds`, "false");
                    setTimeout(async() => {
                        await userTicket.deleteOne({ Guild: interaction.guild.id, Channel: interaction.channel.id });
                        await channel.delete()
                    }, 10000);
                    logMessage(`🌍 Ticket closed\n\n**Ticket name:** ${interaction.channel.name}\n**Ticket creator:** ${userTicket.User}\n**Closed by:** ${interaction.user}`, transcript);
                }
            break;
            case "rename":
                if (!userTicket) return sendMsg("⚠️ This is not a ticket", "true")
                const name = options.getString("name");
                await channel.setName(name);
                sendMsg(`🌍 Ticket name changed to ${name}`, "false");
            break;
            case "add":
                if (!userTicket) return sendMsg("⚠️ This is not a ticket", "true")
                await channel.permissionOverwrites.create([{ id: interaction.options.getUser("user").id, allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]}])

                sendMsg(`🌍 User ${addUser} has been added the ticket`, "false");
            break;
            case "create": 
                const createData = await ticket.findOne({ guildId: interaction.guild.id });
                if(!createData) return sendMsg("⚠️ You cant open a ticket in this server", "true");

                const categoryId = createData.channel;

                let channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    parent: categoryId,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                        },
                        {
                            id: c.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels]
                        },
                    ]
                });
    
                logMessage(`🌍 Ticket opend\n\n**User:** ${interaction.user}\n**Channnl Name:** ${channel.name} (${channel.id})`)
    
                const ar = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("close")
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji("❌")
                        .setLabel("Close Ticket")
                        
                    );
    
                    const embed = new EmbedBuilder()
                    .setTitle("Ticket of " + interaction.user.username)
                    .setDescription("Thanks for opening a ticket\nPlease explain your problem or ask your question")
                    .setColor(c.config.color)
                    
        			await sendMsg("🌍 your ticket has been created: <#"+channel+">", "true")
                    await channel.send({ content: `${interaction.user}`,embeds: [embed], components: [ar] })
    
                    await TicketChannel.create({
                        Guild: interaction.guild.id,
                        Channel: channel.id,
                        User: interaction.user.id,
                    })
            break;
        }


    }
}