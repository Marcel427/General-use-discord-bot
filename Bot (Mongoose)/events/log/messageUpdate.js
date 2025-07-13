const { EmbedBuilder } = require("discord.js");
const log = require("../../schemas/log");

module.exports = {
    name: "messageUpdate",

    async execute (newMessage, oldMessage, c) {
        const guild = newMessage.guild;
        const data = await log.findOne({ Guild: newMessage.guild.id, MsgChannel: {$exists: true} });
        if (newMessage.author.id === c.user.id) return;
        if (newMessage.author.bot) return;
        if (!data) return;

        const channel = guild.channels.cache.get(data.MsgChannel);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor("#000001")
            .setTitle("Message Updated")
            .setDescription(`**Message author:** ${newMessage.author}\n**Old Message:** \n\`${newMessage.content}\`\n**New Message:** \n\`${oldMessage.content}\``)
            .setTimestamp()
            .setFooter({ text: `${guild.name} logs | Send by ${c.user.username}` });

        await channel.send({ embeds: [embed] });
    }
}