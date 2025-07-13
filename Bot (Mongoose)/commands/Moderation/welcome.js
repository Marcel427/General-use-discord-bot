const { SlashCommandBuilder, ChannelType, MessageFlags, EmbedBuilder } = require("discord.js");
const welcome = require("../../schemas/welcome");


module.exports = {
    data: new SlashCommandBuilder()
       .setName("welcome")
       .setDescription("manage the welcome system")
       .addSubcommand(subcommand => subcommand.setName("setup").setDescription("setup the welcome system")
       .addChannelOption(option =>
        option.setName("channel")
           .setDescription("Welcome channel")
           .addChannelTypes(ChannelType.GuildText)
           .setRequired(true)
        ))
        .addSubcommand(subcommand => subcommand.setName("disable").setDescription("Disable the welcome system")),

    async execute(interaction, c) {
        const data = await welcome.findOne({ guildId: interaction.guild.id })
        const sub = interaction.options.getSubcommand();
        async function sendMessage(message) {
            const embed = new EmbedBuilder()
               .setColor(c.config.color)
               .setDescription(message);

               interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
        }

        switch(sub) {
            case "disable":
                if (!data) return sendMessage("⚠️ Welcome system is not enabled.");
                await welcome.deleteOne({ guildId: interaction.guild.id });
                sendMessage("🌍 Welcome system has been disabled.");
                break;
            case "setup":
                const name = interaction.options.getChannel("channel");
                if (!data) {
                    welcome.create({
                        channel: name.id,
                        guildId: interaction.guild.id,
                    });
        
                    sendMessage("🌍 Welcome system has been set up in the " + name,);
                } else {
                    sendMessage("🌍 Welcome system is already been set up",);
                }
        }
        

    },
};