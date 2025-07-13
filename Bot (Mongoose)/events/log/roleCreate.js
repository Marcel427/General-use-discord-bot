const { EmbedBuilder } = require("discord.js");
const log = require("../../schemas/log");

module.exports = {
    name: "roleCreate",

    async execute (role, c) {
        const guild = role.guild;
        const data = await log.findOne({ Guild: role.guild.id, RoleChannel: {$exists: true} });
        if (!data) return;
        const channel = guild.channels.cache.get(data.RoleChannel);
        if(!channel) return;

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("New Role Created")
            .setDescription(`**Name:** ${role.name} (${role.id})`)
            .setTimestamp()
            .setFooter({ text: `${guild.name} logs | Send by ${guild.me.username}` });

        channel.send({ embeds: [embed] });
    }
}