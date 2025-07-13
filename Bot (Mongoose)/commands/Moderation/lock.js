const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock or unlock a channel of your server")
    .addSubcommand(
        subcommand => subcommand
        .setName("lock")
        .setDescription("Lock a channel of your server")
        .addChannelOption(
            option  => option
            .setName("channel")
            .setDescription("The channel to lock")
            .setRequired(false)
        )
        .addStringOption(
            option => option 
            .setName("reason")
            .setDescription("Whats the reason for the lock")
        )
    )
    .addSubcommand(
        subcommand => subcommand
        .setName("unlock")
        .setDescription("Unlock a channel of your server")
        .addChannelOption(
            option  => option
            .setName("channel")
            .setDescription("The channel to unlock")
            .setRequired(false)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

    async execute(interaction) {
        const { options, guild, user } = interaction; 

        const sub = options.getSubcommand();
        const channel = options.getChannel("channel") || interaction.channel;

        async function sendMsg(msg) {
            const embed = new EmbedBuilder()
            .setColor(c.config.color)
            .setDescription(msg)

            interaction.reply({ embeds: [embed] })
        };

        switch(sub) {
            case "lock":
                const reason = options.getString("reason") || "No reason given";
                
                channel.permissionOverwrites.set([
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.SendMessages]
                    }
                ]);

                var str = `🔒 Channel locked`
                str += `\n\n**Channel:**\n${channel} (${channel.id})\n\n**Moderator:**\n${user} (${user.id})\n\n**Reason:**\n\`${reason}\``

                await sendMsg(str);
            break;

            case "unlock":
                channel.permissionOverwrites.set([
                    {
                        id: interaction.guild.id,
                        allow: [PermissionsBitField.Flags.SendMessages]
                    }
                ]);

                var str = `🔓 Channel unlocked`
                str += `\n\n**Channel:**\n${channel} (${channel.id})\n\n**Moderator:**\n${user} (${user.id})`

                sendMsg(str);
            break;
        }
    }
}