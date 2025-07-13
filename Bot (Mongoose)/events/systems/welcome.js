const { EmbedBuilder } = require("discord.js")
const welcome = require("../../schemas/welcome");

module.exports = {
    name: "guildMemberAdd",

    async execute(member, c) {
        const data = await welcome.findOne({ guildId: member.guild.id });
        if (!data) { return; }

        const welcomeEmbed = new EmbedBuilder()
           .setColor(c.config.color)
           .setAuthor({name:"Welcome to the server!", iconURL: member.guild.iconURL() })
           .setDescription(`Welcome, ${member.user}!`)
           .setThumbnail(member.user.displayAvatarURL())
           .setTimestamp()
           .setFooter({ text: "Send by "+c.user.username });

        await member.guild.channels.cache.get(data.channel).send({ embeds: [welcomeEmbed] });
    }
}