const { ChannelType, GuildVoice, Collection, PermissionsBitField } = require("discord.js");
const voiceManager = new Collection();
const jtc = require("../../schemas/joinToCreate");

module.exports = {
    name: "voiceStateUpdate",

    async execute(oldState, newState, c) {
        const { member, guild } = oldState;
        const newChannel = newState.channel;
        const oldChannel = oldState.channel;
        const data = await jtc.findOne({ Guild: oldState.guild.id });

        if (!data) return;
            const channelid = data.Channel
            const channel = c.channels.cache.get(channelid);
        	let noc = data.ChannelName

            if (oldChannel !== newChannel && newChannel && newChannel.id === channel.id) {
                const voiceChannel = await guild.channels.create({
                    name: await noc.replace("!member", member.user.username),
                    type: ChannelType.GuildVoice,
                    parent: newChannel.parent,
                    permissionOverwrites: [
                        {
                            id: member.id,
                            allow: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ManageChannels]
                        },
                        {
                            id: guild.id,
                            allow: [PermissionsBitField.Flags.Connect]
                        }
                    ]
                })

                voiceManager.set(member.id, voiceChannel.id);

                await newChannel.permissionOverwrites.edit(member, {
                    Connect: false
                });
                setTimeout(() => {
                    newChannel.permissionOverwrites.delete(member)
                }, 30000)

                return setTimeout(() => {
                    member.voice.setChannel(voiceChannel)
                }, 500)
            }

            const jointocreate = voiceManager.get(member.id);
            const members = oldChannel?.members
            .filter((m) => !m.user.bot)
            .map((m) => m.id)

            if (
                jointocreate &&
                oldChannel.id === jointocreate &&
                (!newChannel || newChannel.id !== jointocreate)
            ) {
                if (members.length > 0) {
                    let randomID = members[Math.floor(Math.random() * members.length)];
                    let randomMember = guild.members.cache.get(randomID);
                    randomMember.voice.setChannel(oldChannel).then((v) => {
                        oldChannel.setName("🔊 » " + randomMember.user.username).catch((e) => null);
                        oldChannel.permissionOverwrites.edit(randomMember, {
                            Connect: true,
                            ManageChannels: true
                        })
                    })
                    voiceManager.set(member.id, null)
                    voiceManager.set(randomMember.id, oldChannel.id)
                } else if(members.length < 1) {
                    voiceManager.set(member.id, null)
                    oldChannel.delete().catch((e) => null)
                }
            }
            
        }
    }