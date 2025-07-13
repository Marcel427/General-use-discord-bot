const memberCount = require("../../schemas/memberCount")

module.exports = {
    name: "guildMemberRemove",

    async execute(member) {
        const data = await memberCount.findOne({ Guild: member.guild.id })
        if (!data) return;
        const members = member.guild.memberCount;
        const channel = member.guild.channels.cache.get(data.Channel)
        if (!channel) return;
        await channel.setName(data.ChannelName.replace("!count", members.toLocaleString()))
    }
}