const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder, MessageFlags} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Delete messages from a channel or user from your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option => option.setName("number").setDescription("Number of messages to be deleted").setMinValue(1).setMaxValue(99).setRequired(true))
    .addUserOption(option => option.setName("user").setDescription("choose a user you want to delete messages from"))
    .setDMPermission(false),

    async execute(interaction, c) {
        const {channel, options} = interaction;

        const anzahl = options.getInteger("number");
        const user = options.getUser("user");

        const messages = await channel.messages.fetch({
            limit: anzahl +1,
        })

        async function sendMessage(message) {
            const embed = new EmbedBuilder()
            .setColor(c.config.color)
            .setDescription(message)

            interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral})
        }

        if(user) {
            let i = 0;
            const filtered = [];
            i++;

            (await messages).filter((msg) => {
                if(msg.author.id === user.id && anzahl > 1) {
                    filtered.push(msg);
                    i++;
                }
            });

            await channel.bulkDelete(filtered).then(messages => {
                sendMessage(`🌍 successfully deleted **${messages.size}** messages from **${user}**`)
            })
        } else {
            await channel.bulkDelete(anzahl, true).then(messages => {
                sendMessage(`🌍 successfully deleted **${messages.size}** messages from the channel`)
            })
        }
    }
}