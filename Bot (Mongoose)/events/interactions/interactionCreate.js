const { EmbedBuilder, MessageFlags, ActionRowBuilder, ButtonStyle, ButtonBuilder, ComponentType, ChannelType, WebhookClient } = require("discord.js");
const errorLog = require("../../schemas/error");
const TOSAccept = require("../../schemas/TOSAccept")

module.exports = {
    name: "interactionCreate",

    async execute(interaction, c) {

        async function sendMsg(msg) {
            const embed = new EmbedBuilder()
            .setDescription(msg)
            .setColor(c.config.color)

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
        }

        // Interaction Handler
        if(!interaction.isChatInputCommand()) return;

        if (
            !interaction.channel ||
            (interaction.channel.type === ChannelType.DM) ||
            (interaction.channel.type === ChannelType.GroupDM)
        ) {
            const command = c.commands.get(interaction.commandName);
            let description = "❌ This command is blocked in DMs. Please use it in a server.";
            if (!command) {
                description += "\n⚠️ Also, this command was not found or is outdated.";
            }
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(description)
                    .setColor(c.config.color)
                ],
            });
        }

        const command = c.commands.get(interaction.commandName);

        try {
            const cmd = await command.execute(interaction, c)
        }catch(error) {
            console.error(error);
            
            const sendChannel = new WebhookClient({ url: c.config.infoWebhook });

            var errTime = `<t:${Math.floor(Date.now() / 1000)}:R>`

            const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("An error has been flagged while using a slash command.")
            .addFields({ name: "Error Command", value: `\`/${interaction.commandName}\``})
            .addFields({ name: `Error Message`, value: `\`${error.message}\`` })
            .addFields({ name: "Error Timestamp", value: `${errTime}`})
            .setFooter({ text: `Error flag System | ${c.user.username} (${c.user.id})` })
            .setTimestamp()

            await sendChannel.send({ embeds: [embed], components: [ar] });

            setTimeout(() => {
                
            }, 2000);
            
            sendMsg("⚠️ Error occured while executing the command, the devs are informed"); 
        }

        
        
    },
}