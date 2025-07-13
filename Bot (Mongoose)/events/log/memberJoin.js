const log = require("../../schemas/log");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",

    async execute(member, c) {
        const data = await log.findOne({ Guild: member.guild.id, JoinLeaveChannel: {$exists: true} });

        if (!data) return;

        async function logMessage(message) {
            const channel = member.guild.channels.cache.get(data.JoinLeaveChannel);
            if (!channel) return;
            
            const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(message)
            .setTimestamp()
            .setFooter({ text: `${member.guild.name} logs | Send by ${c.user.username}`});

            channel.send({ embeds: [embed] })
        }
            
        logMessage(`🌍 New member\n\n**User:** ${member} (${member.id})\n`)
    }
}
