const { MessageFlags, TextInputBuilder, ModalBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ChannelType, Embed } = require("discord.js");
const TicketChannel = require("../../schemas/ticketChannel")
const { createTranscript } = require("discord-html-transcripts")
const verfiy = require("../../schemas/verify");
const tickets = require("../../schemas/tickets");
const log = require("../../schemas/log");
const releasenotes = require("../../schemas/releasenotes");
//const AAMSchema = require("../../schemas/advancedAutoMod");
const TOSAccept = require("../../schemas/TOSAccept");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, c) {
        
        async function sendMessage(message, ephemeral) {
            const embed = new EmbedBuilder()
            .setColor(c.config.color)
            .setDescription(message)
            if (ephemeral === "true") {
                interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            } else if(ephemeral === "false") {
                interaction.reply({ embeds: [embed] });
            }
        }

        async function logMessage(message, file) {
            const logData = await log.findOne({ Guild: interaction.guild.id, TicketChannel: {$exists: true} });
            if (!logData) return;
            const channel = interaction.guild.channels.cache.get(logData.TicketChannel)

            const embed = new EmbedBuilder()
            .setColor(c.config.color)
            .setDescription(message)

            channel.send({ embeds: [embed], files: [file] })
        }

        if (!interaction.isButton()) return;
        if (interaction.customId === "close") {
            const ticketdata = await TicketChannel.findOne({ Guild: interaction.guild.id, Channel: interaction.channel.id });

            const transcript = await createTranscript(interaction.channel, {
                limit: -1,
                returnBuffer: false,
                filename: `ticket-${ticketdata.User}.html`
            })

            if(!logData) {
                sendMessage(`🌍 Ticket will be closed in 10 seconds`, "false");
                setTimeout(async() => {
                    await TicketChannel.deleteOne({ Guild: interaction.guild.id, Channel: interaction.channel.id });
                    await interaction.channel.delete()
                }, 10000);
            } else {
                sendMessage(`🌍 Ticket will be closed in 10 seconds`, "false");
                setTimeout(async() => {
                    await TicketChannel.deleteOne({ Guild: interaction.guild.id, Channel: interaction.channel.id });
                    await interaction.channel.delete()
                }, 10000);
                logMessage(`🌍 Ticket closed\n\n**Ticket name:** ${interaction.channel.name}\n**Ticket creator:** ${ticketdata.User}\n**Closed by:** ${interaction.user}`, transcript);
            }
            

        }

        if(interaction.customId === "accept") {
            const verifydata = await verfiy.findOne({ guild: interaction.guild.id });
            if (!verifydata) return sendMessage("⚠️ this system has been disabled", "true");
            sendMessage(`🌍 You've accepted the rules and tos! \n you got the <@&${verifydata.role}> role`, "true");
            interaction.member.roles.add(verifydata.role)
        } else if (interaction.customId === "deny") {
            sendMessage("⚠️ You've denied the rules and tos! \nyou wont see any channels until you accept the rules and tos.", "true")
        }

        if (interaction.customId === "ticket-open") {
            const data = await tickets.findOne({ guildId: interaction.guild.id});
        
            if (!data) return;
                async function logMessage(message) {
                    if(!logData) return;
                    const channel = interaction.guild.channels.cache.get(logData.TicketChannel)
    
                    const embed = new EmbedBuilder()
                    .setColor(c.config.color)
                    .setDescription(message)
    
                    
                    channel.send({ embeds: [embed] })
                }
    
                let channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    parent: data.channel,
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
                    
        			await sendMessage("🌍 your ticket has been created: <#"+channel+">", "true")
                    await channel.send({ content: `${interaction.user}`,embeds: [embed], components: [ar] })
    
                    await TicketChannel.create({
                        Guild: interaction.guild.id,
                        Channel: channel.id,
                        User: interaction.user.id,
                    })
        }

        if (interaction.customId === "maininfo1353426104764989503") {
            const data = await releasenotes.find();
            let InfoEmbed = new EmbedBuilder()
            .setTitle("Some Info about the bot")
            .setColor(c.config.color)
            .setDescription([
                "This bot is made by the Cordinal Services Team",
                "- It's fully made in javascript",
                "- It's an all around bot",
                "- If you want to see some of its commands use </help:1248591362081951786>",
                `- It operates in **${c.guilds.cache.size}** servers`,
                `-# There is no Dashboard for this bot yet`
            ].join("\n"))
            .setThumbnail(c.user.displayAvatarURL())

            if (!data) {
                InfoEmbed.setTimestamp()
                InfoEmbed.setFooter({ text: "Send by " + c.user.username })
                interaction.reply({ embeds: [InfoEmbed], flags: MessageFlags.Ephemeral })
            } else {
                var str = ``;
                await data.forEach(async value => {
                    str += `**Latest Update:** \`${value.Version}\`\n\n\`\`\`${value.Updates}\`\`\``
                });
                const UpdateEmbed = new EmbedBuilder()
                .setColor(c.config.color)
                .setDescription(str)
                .setTimestamp()
                .setFooter({ text: "Send by " + c.user.username })

                interaction.reply({ embeds: [InfoEmbed, UpdateEmbed], flags: MessageFlags.Ephemeral })
            }
        }

        if (interaction.customId === "accept_tos") {
            const guildId = interaction.guild.id;
            const existingEntry = await TOSAccept.findOne({ guildId });

            if (existingEntry) {
                return sendMessage("⚠️ You've already accepted the TOS!", "true");
            }

            await TOSAccept.create({ guildId });
            await sendMessage("🌍 You've accepted the TOS!", "true");
            setTimeout((interaction) => {interaction.channel.bulkDelete(1, true)}, 10000);
            
        }
        
        //if (interaction.customId === "aam-setup") {
        //    await AAMSchema.create({ Guild: interaction.guild.id, Paused: false })
        //    sendMessage("🌍 The system was setup", "true");
        //} else if (interaction.customId === "aam-pause") {
        //    await AAMSchema.findOneAndUpdate({ Guild: interaction.guild.id, Paused: true});
        //    sendMessage("🌍 The system was paused", "true");
        //} else if (interaction.customId === "aam-resume") {
        //    await AAMSchema.findOneAndUpdate({ Guild: interaction.guild.id, Paused: false });
        //    sendMessage("🌍 The system was resumed", "true");
        //}
    }
}