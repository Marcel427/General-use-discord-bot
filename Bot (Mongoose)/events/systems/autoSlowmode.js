const autoSlowmodeSchema = require('../../schemas/autoSlowmode');

let messageCount = 0;
let interval;

module.exports = {
    name: "messageCreate",

    async execute(message) {
        if (message.author.bot) return;
        const data = await autoSlowmodeSchema.findOne({ guildId: message.guild.id });
        if (!data) return;

        messageCount++;

        if (!interval) {
            interval = setInterval(async () => {
                if (messageCount > 20) {
                    const channel = message.guild.channels.cache.get(data.channelId);
                    if (channel) {
                        await channel.setRateLimitPerUser(data.maxSlowmode);
                    } else {
                        return;
                    }
                } else {
                    const channel = message.guild.channels.cache.get(data.channelId);
                    if (channel) {
                        await channel.setRateLimitPerUser(data.minSlowmode);
                    } else {
                        return;
                    }
                }

                messageCount = 0;
            }, 1000);
        }
    }
};