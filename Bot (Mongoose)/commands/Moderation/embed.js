const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, MessageFlags } = require("discord.js");
const embed = require("../../schemas/embed");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Manage your custom bot embeds")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand => subcommand
        .setName("create")
        .setDescription("Create a custom embed")
    )
    .addSubcommand(subcommand => subcommand
        .setName("edit")
        .setDescription("Edit an existing custom embed")
        .addStringOption(option => option
            .setName("id")
            .setDescription("Enter the message id of your embed")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName("view")
        .setDescription("View your custom embeds")
    )
    .addSubcommand(subcommand => subcommand
        .setName("delete")
        .setDescription("Delete a custom embed")
        .addStringOption(option => option
            .setName("id")
            .setDescription("Enter the message id of your embed")
            .setRequired(true)
        )
    ),

    async execute(interaction, c) {
        const sub = interaction.options.getSubcommand();

        async function sendMessage(message) {
            const embed = new EmbedBuilder()
            .setColor(c.config.color)
            .setDescription(message)

            interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        };

        switch (sub) {
            case "create":
                const createModal = new ModalBuilder()
                .setTitle("🌍 Create you custom embed")
                .setCustomId("embed")
           
                const ctitle = new TextInputBuilder()
                    .setCustomId("title")
                    .setLabel("Title")
                    .setStyle(TextInputStyle.Short)
                const cdesc = new TextInputBuilder()
                    .setCustomId("description")
                    .setLabel("Description")
                    .setStyle(TextInputStyle.Paragraph)
                const ccolor = new TextInputBuilder()
                    .setCustomId("color")
                    .setLabel("Color (Hexadecimal)")
                    .setStyle(TextInputStyle.Short)
                    .setMinLength(0)
                    .setMaxLength(7)
                    .setRequired(false)
                const cfooter = new TextInputBuilder()
                    .setCustomId("footer")
                    .setLabel("Footer Text")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
                const cthumb = new TextInputBuilder()
                    .setCustomId("thumbnail")
                    .setLabel("Thumbnail URL")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
            
                const atitle = new ActionRowBuilder().addComponents(ctitle)
                const adesc = new ActionRowBuilder().addComponents(cdesc)
                const acolor = new ActionRowBuilder().addComponents(ccolor)
                const afooter = new ActionRowBuilder().addComponents(cfooter)
                const athumb = new ActionRowBuilder().addComponents(cthumb)

                createModal.addComponents(atitle, adesc, acolor, afooter, athumb)
                interaction.showModal(createModal)
            break;
            case "edit":
                const edit_id = interaction.options.getString("id");

                const edit_data = await embed.findOne({ Guild: interaction.guild.id, id: edit_id });

                if (!edit_data) return sendMessage("⚠️ There is no embed with that id in your server");
                const editModal = new ModalBuilder()
                .setTitle("🌍 Edit your custom embed | 🪪 ID: " + edit_id)
                .setCustomId("editembed")
           
                const etitle = new TextInputBuilder()
                    .setCustomId("title")
                    .setLabel("Title")
                    .setStyle(TextInputStyle.Short)
                const desc = new TextInputBuilder()
                    .setCustomId("description")
                    .setLabel("Description")
                    .setStyle(TextInputStyle.Paragraph)
                const color = new TextInputBuilder()
                    .setCustomId("color")
                    .setLabel("Color (Hexadecimal)")
                    .setStyle(TextInputStyle.Short)
                    .setMinLength(0)
                    .setMaxLength(7)
                    .setRequired(false)
                const footer = new TextInputBuilder()
                    .setCustomId("footer")
                    .setLabel("Footer Text")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
                const thumb = new TextInputBuilder()
                    .setCustomId("thumbnail")
                    .setLabel("Thumbnail URL")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)
            
                const ftitle = new ActionRowBuilder().addComponents(etitle)
                const fdesc = new ActionRowBuilder().addComponents(desc)
                const fcolor = new ActionRowBuilder().addComponents(color)
                const ffooter = new ActionRowBuilder().addComponents(footer)
                const fthumb = new ActionRowBuilder().addComponents(thumb)

                editModal.addComponents(ftitle, fdesc, fcolor, ffooter, fthumb)
                await interaction.showModal(editModal)

                c.on("interactionCreate", async(interaction) => {
                    if (!interaction.isModalSubmit()) return;
                    if (interaction.customId === "editembed") {
                        const title = interaction.fields.getTextInputValue("title");
                        const description = interaction.fields.getTextInputValue("description");
                        const color = interaction.fields.getTextInputValue("color") || c.config.color;
                        const footer = interaction.fields.getTextInputValue("footer") || "Send by "+c.user.username;
                        const thumbnail = interaction.fields.getTextInputValue("thumbnail");


                        const embed = new EmbedBuilder()
                        .setTitle(title)
                        .setDescription(description)
                        .setColor(color)
                        .setFooter({ text: `${footer}` })
                        .setTimestamp()
                        
                        if (thumbnail.length > 0) {
                            embed.setThumbnail(thumbnail);
                        }

                        const channel = await interaction.guild.channels.cache.get(edit_data.Channel);
                        const editId = edit_data.Msg;
                        channel.messages.fetch(editId).then((message) =>
                            message.edit({ embeds: [embed] })
                        );
                    }
                })


                
            break;
            case "view":
                const data = await embed.find({ Guild: interaction.guild.id });

                if(data.length == 0 ) {
                    return sendMessage("⚠️ There are no embeds in your server");
                } else  {
                    var string = `🔗 **Server embeds:**\n`;
                    await data.forEach(async value => {
                        string += `\n> https://discord.com/channels/${value.Guild}/${value.Channel}/${value.Msg} | ID: \`${value.id}\``;
                    });

                    await sendMessage(string);
                }
            break;
            case "delete":
                const db_id = interaction.options.getString("id");

                const d_data = await embed.findOneAndDelete({ Guild: interaction.guild.id, id: db_id });

                if (!d_data) return sendMessage("⚠️ There is no embed with that id in your server");

                const channel = await interaction.guild.channels.cache.get(d_data.Channel);
                if (!channel) {
                    return await embed.deleteOne({ Guild: interaction.guild.id, id: db_id })
                    .then(sendMessage("⚠️ The channel wasn't found"));
                } else {
                    const msg = await channel.messages.cache.get(d_data.Msg);
                    if (!msg) {
                        return await embed.deleteOne({ Guild: interaction.guild.id, id: db_id })
                        .then(sendMessage("⚠️ The message wasn't found"));
                    } else {
                        msg.delete;
                        embed.deleteOne({ Guild: interaction.guild.id, id: db_id });

                        sendMessage(`🌍 Your embed has been deleted \n\nEmbed ID: \`${d_data.Msg}\`\nDB ID: \`${d_data.id}\``);
                    }
                }
                
            break;
        }
    }
}

