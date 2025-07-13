const { EmbedBuilder } = require("discord.js");
const log = require("../../schemas/log");

module.exports = {
    name: "messageDelete",

    async execute (message, c) {
        const guild = message.guild;
        const data = await log.findOne({ Guild: message.guild.id, MsgChannel: {$exists: true} });
        if (message.author.id === c.user.id) return;
        if (message.author.bot) return;
        if (!data) return;
        const channel = guild.channels.cache.get(data.MsgChannel);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Message Deleted")
            .setDescription(`**Message author:** ${message.author}\n**Message:** \n\`${message.content}\``)
            .setTimestamp()
            .setFooter({ text: `${guild.name} logs | Send by ${c.user.username}` });

        await channel.send({ embeds: [embed] });
    }
}