const { EmbedBuilder } = require("discord.js");
const log = require("../../schemas/log");

module.exports = {
    name: "roleUpdate",

    async execute (newRole, oldRole, c) {
        const guild = newRole.guild;
        const data = await log.findOne({ Guild: newRole.guild.id, RoleChannel: {$exists: true} });
        if (!data) return;
        const channel = guild.channels.cache.get(data.RoleChannel);
        if (!channel) return;

        if (oldRole.name === newRole.name) return;
        const embed = new EmbedBuilder()
            .setColor("#000001")
            .setTitle("Role Updated")
            .setDescription(`**Old Name:** \`${oldRole.name}\`\n**New name:** \`${newRole.name}\`\n**Role ID:** \`${newRole.id}\``)
            .setTimestamp()
            .setFooter({ text: `${guild.name} logs | Send by ${guild.me.username}` });

        channel.send({ embeds: [embed] });
    }
}