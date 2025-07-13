const { EmbedBuilder, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ticketChannel = require("../../schemas/ticketChannel");
const embed = require("../../schemas/embed");

module.exports ={
    name: "interactionCreate",

    async execute(interaction, c) {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId === "embed") {
            const title = interaction.fields.getTextInputValue("title");
            const description = interaction.fields.getTextInputValue("description");
            const color = interaction.fields.getTextInputValue("color") || c.config.color;
            const footer = interaction.fields.getTextInputValue("footer") || "Send by "+c.user.username;
            const thumbnail = interaction.fields.getTextInputValue("thumbnail");

            async function sendMessage(message) {
                const embed = new EmbedBuilder()
                .setDescription(message)
                .setColor(c.config.color)
                

                interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            }

            const MsgEmbed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setFooter({ text: `${footer}` })
            .setTimestamp()
            
            if (thumbnail.length > 0 || thumbnail.endsWith(".png" || ".jpg" || ".webp")) {
                embed.setThumbnail(thumbnail);
            }

            // create unique id
            let dbId = 1
            const result = await embed.findOne({ Guild: interaction.guild.id, id: dbId });
            while(result) {
                const result = await embed.findOne({ Guild: interaction.guild.id, id: dbId });
                if (result) {
                    dbId = dbId + 1
                } else {
                    break;
                } 
            }
            let finalId = dbId.toString();

            sendMessage("🌍 Embed created successfully");
            const msg = await interaction.channel.send({ embeds: [MsgEmbed] });
            await embed.create({
                Guild: interaction.guild.id,
                Channel: interaction.channel.id,
                Msg: msg.id,
                id: finalId
            });
        }
    }
}