const { EmbedBuilder } = require("discord.js");
const log = require("../../schemas/log");

module.exports = {
    name: "roleDelete",

    async execute (role, c) {
        const guild = role.guild;
        const data = await log.findOne({ Guild: role.guild.id, RoleChannel: {$exists: true} });
        if (!data) return;
        const channel = guild.channels.cache.get(data.RoleChannel);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Role Deleted")
            .setDescription(`**Name:** ${role.name} (${role.id})`)
            .setTimestamp()
            .setFooter({ text: `${guild.name} logs | Send by ${c.user.username}` });

        channel.send({ embeds: [embed] });
    }
}