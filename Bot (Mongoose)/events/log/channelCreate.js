const { EmbedBuilder } = require("discord.js");
const log = require("../../schemas/log");

module.exports = {
    name: "channelCreate",

    async execute (channel, c) {
        const guild = channel.guild;
        const data = await log.findOne({ Guild: channel.guild.id, ChannelChannel: {$exists: true} });
        if (!data) return;
        const logchannel = guild.channels.cache.get(data.ChannelChannel);
        if (!logchannel) return;

        const category = channel.parent;

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("Channel Created")
            .setDescription(`**Name:** \`${channel.name} (${channel.id})\`\n**Category:** ${category}`)
            .setTimestamp()
            .setFooter({ text: `${channel.guild.name} logs | Send by ${c.user.username}`})

        logchannel.send({ embeds: [embed] });
    }
}