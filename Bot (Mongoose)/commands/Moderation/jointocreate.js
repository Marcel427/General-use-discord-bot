const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits, MessageFlags, PermissionsBitField } = require("discord.js");
const jtc = require("../../schemas/joinToCreate");

module.exports = {
    data: new SlashCommandBuilder()
       .setName("jointocreate")
       .setDescription("Manage the join to create system")
       .addSubcommand(subcommand => subcommand
        .setName("setup")
        .setDescription("Setup the join to create system")
        .addChannelOption(options => options.setName("channel").setDescription("Select the channel for the join to create system").setRequired(false))
        .addStringOption(options => options.setName("channel-name").setDescription("Created user channel name (Use !member for the user name of the user that joins)").setRequired(false))
       )
       .addSubcommand(subcommand => subcommand
        .setName("disable")
        .setDescription("Disable the join to create system")
       )
       .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

       async execute(interaction) {
        async function sendMessage(msg) {
            const embed = new EmbedBuilder()
            .setColor(c.config.color)
            .setDescription(msg)

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

        const sub = interaction.options.getSubcommand();
        const data = await jtc.findOne({ Guild: interaction.guild.id });

        switch (sub) {
            case "setup": 
                const channel_name = interaction.options.getString("channel-name") || `» !member`
                const channel = interaction.options.getChannel("channel") || await interaction.guild.channels.create({
                    name: `» Join To Create`,
                    type: ChannelType.GuildVoice,
                    parent: data.channel,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect]
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ManageChannels],
                            deny: [PermissionsBitField.Flags.Speak]
                        },
                        {
                            id: c.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels]
                        },
                    ]
                });
                if(data) return sendMessage("⚠️ The join to create system has already been setup")
                await jtc.create({ Guild: interaction.guild.id, Channel: channel.id, ChannelName: channel_name });
                await sendMessage("🌍 The join to create system has been setup for: "+channel)
            break

            case "disable": 
                if(!data) return sendMessage("⚠️ The join to create system has not been setup yet")
                await jtc.deleteOne({ Guild: interaction.guild.id });
                sendMessage("🌍 Join to create system disabled");
            
       }
    }  
}