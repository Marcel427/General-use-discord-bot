const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuComponent, StringSelectMenuOptionBuilder, MessageFlags, ButtonBuilder, ButtonStyle} = require("discord.js");
const tickets = require("../../schemas/tickets");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ticket-manager")
    .setDescription("Manage the ticket system")
    .addSubcommand(
        subcommand => subcommand
        .setName("setup")
        .setDescription("Setup the ticket system")
        .addChannelOption(option => option.setName("channel").setDescription("setup your ticket channel").setRequired(true).addChannelTypes(ChannelType.GuildText))
        .addChannelOption(option => option.setName("category").setDescription("The category you want your tickets in").setRequired(true).addChannelTypes(ChannelType.GuildCategory))
    )
    .addSubcommand(
        subcommand => subcommand
       .setName("disable")
       .setDescription("disable the ticket system")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, c) {
        const data = await tickets.findOne({ Guild: interaction.guild.id })
        const { options, guild } = interaction;
        const sub = options.getSubcommand();

        const channel = options.getChannel("channel");
        const category = options.getChannel("category");

        async function sendMessage(message) {
            const embed = new EmbedBuilder()
             .setColor(c.config.color)
             .setDescription(message)

             interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
        }

        switch(sub) {
            case "setup":
                if(!data) {
                    tickets.create({
                        guildId: interaction.guild.id,
                        channel: category.id,
                    })
                } else return sendMessage("⚠️ The ticket system has already been setup")


                const embed = new EmbedBuilder()
                .setColor(c.config.color)
                .setTitle("Ticket System")
                .setDescription("You can open a ticket with the \"Open Ticket\" button down below\n\nPlease explain your problem or question in the ticket that you opend")
                .setFooter({ text: `${interaction.guild.name} tickets | Send by ${c.user.username}`})
                .setThumbnail(interaction.guild.iconURL())
                .setTimestamp()
            
                const select = new ButtonBuilder()
                    .setCustomId("ticket-open")
                    .setEmoji("🎫")
                    .setLabel("Open Ticket")
                    .setStyle(ButtonStyle.Success) 

                const ar = new ActionRowBuilder().addComponents(select)


            
                await channel.send({ embeds: [embed], components: [ar] })
                .then(sendMessage(`🌍 Your ticket system has been set up in ${channel}`));
            break;
            case "disable":
                if(data) {
                    await tickets.findOneAndDelete({ guildId: interaction.guild.id });
                    sendMessage("🌍 Your ticket system has been disabled");
                } else {
                    return sendMessage("⚠️ Your ticket system hasn't been setup yet");
                }
            break;
                
    }            
}
}
