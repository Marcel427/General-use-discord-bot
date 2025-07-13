const { EmbedBuilder } = require("discord.js");
const log = require("../../schemas/log");

module.exports = {
    name: "channelUpdate",

    async execute (newChannel, oldChannel, c) {
        const guild = newChannel.guild;
        const data = await log.findOne({ Guild: newChannel.guild.id, ChannelChannel: {$exists: true} });
        if (!data) return;
        const logchannel = guild.channels.cache.get(data.ChannelChannel);
        if (!logchannel) return;

        if (oldChannel.name === newChannel.name && oldChannel.parent === newChannel.parent) return;
        if (oldChannel.name !== newChannel.name) {
            const embed = new EmbedBuilder()
            .setColor("#000001")
            .setTitle("Channel name changed")
            .setDescription(`**Old Name:** \`${newChannel.name}\`\n**New Name:** \`${oldChannel.name}\``)
            .setTimestamp()
            .setFooter({ text: `${guild.name} logs | Send by ${c.user.username}`});

            logchannel.send({ embeds: [embed] });
        } else if (oldChannel.parent !== newChannel.parent) {

            const newCategory = newChannel.parent;
            const oldCategory = oldChannel.parent;
            const embed = new EmbedBuilder()
            .setColor("#000001")
            .setTitle("Channel category changed")
            .setDescription(`**Channel name:** \`${newChannel.name} (${newChannel.id})\n\`**Old category:** ${newCategory}\n**New category:** ${oldCategory}`)
            .setTimestamp()
            .setFooter({ text: `${guild.name} logs | Send by ${c.user.username}`});

            logchannel.send({ embeds: [embed] });
        }
        
    }
}