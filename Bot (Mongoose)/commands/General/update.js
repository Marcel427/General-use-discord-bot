const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const notes = require("../../schemas/releasenotes");
const announce = require("../../schemas/announce");

module.exports = {
    data: new SlashCommandBuilder()
       .setName("update")
       .setDescription("Update system")
       .addSubcommand(subcommand => subcommand.setName("publish").setDescription("Add new update notes (developers only) (SPACE for new line)").addStringOption(option => option.setName("update-notes").setDescription("The notes to publish").setRequired(true)))
       .addSubcommand(subcommand => subcommand.setName("view").setDescription("View the most recent update notes")),

        async execute(interaction, c) {
            const { options } = interaction;
            const sub = options.getSubcommand();
            var data = await notes.find();

            async function sendMessage(message) {
                const embed = new EmbedBuilder()
                   .setColor(c.config.color)
                   .setDescription(message);
                
                await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            };

            async function updateNotes(update, version) {
                await notes.create({
                    Updates: update,
                    Date: Date.now(),
                    Developer: interaction.user.username,
                    Version: version
                });

                await sendMessage(`🌍 I have updated your release notes`);
            }

            switch(sub) {
                case "publish":
                    if (interaction.user.id !== "948448009509810208") {
                        await sendMessage("⚠️ Only developers can use this command");
                        return;

                        async function sendAnnounce(message) {
                            var announceData = await announce.find();
                            var notesData = await notes.find();
                            var string = `🌍 Bot update ${notesData.Version}`;
                            await notesData.forEach(async value => {
                                string += `\n\n**Update Information**\n\`\`\`${value.Updates}\`\`\`\n\n**Updating Developer:** ${value.Developer}\n**Update Date:** <t:${Math.floor(value.Date / 1000)}:R>`
                            });

                            const channel = interaction.guild.channels.cache.get(announceData.DevChannel);
                            await channel.send({ embeds: [new EmbedBuilder().setColor("#000001").setDescription(string)] });
                        }
                    } else {
                        let update = options.getString("update-notes");

                        if (update.includes("SPACE")) {
                                update = update.replace(/SPACE/g, "\n");
                        };
                        
                        if (data.length > 0) {
                            await notes.deleteMany();

                            var version = 0;
                            await data.forEach(async value => {
                                version += value.Version + 0.1;
                            });

                            version = Math.round(version *10)/10;

                            await updateNotes(update, version);

                        } else {
                            await updateNotes(update, 1.0);
                        }
                    }
                break;

                case "view":
                    if (data.length == 0) {
                        await sendMessage("⚠️ No release notes found");
                    } else {
                        var string = ``;
                        await data.forEach(async value => {
                            string += `\`${value.Version}\` \n\n**Update Information**\n\`\`\`${value.Updates}\`\`\`\n\n**Updating Developer:** ${value.Developer}\n**Update Date:** <t:${Math.floor(value.Date / 1000)}:R>`
                        });

                        await sendMessage(`🌍 **Release notes** ${string}`);
                    }
            }
        } 
       
};