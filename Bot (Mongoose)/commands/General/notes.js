const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const note = require("../../schemas/note");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("notes")
        .setDescription("manage your own server wide notes")
        .addSubcommand(subcommand => subcommand
            .setName("create")
            .setDescription("Create a new server wide note")
            .addStringOption(option => option
                .setName("header")
                .setDescription("The header of the note")
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName("note")
                .setDescription("The content of the note")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("delete")
            .setDescription("Delete a server wide note")
            .addStringOption(option => option
                .setName("id")
                .setDescription("Enter the id of your note (Type \"ALL\" to delete all)")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("view")
            .setDescription("View your notes")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

        async execute(interaction, c) {
            const { options, user } = interaction;
            const sub = options.getSubcommand();

            // Reply
            async function sendMessage(msg) {
                const embed = new EmbedBuilder()
                .setDescription(msg)
                .setColor(c.config.color)

                interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
            };

            // Switch case
            switch (sub) {
                case "create":
                    const header = options.getString("header");
                    const noteContent = options.getString("note");

                    const data = await note.find({ user: user.id })

                    if (data.length == 10) return sendMessage("⚠️ You have reached the maximum of notes \nuse `/note delete` to delete a note");
                        // Generate unique ID
                        let dbId = 1
                        const result = await note.findOne({ user: user.id, id: dbId });
                        while(result) {
                            const result = await note.findOne({ user: user.id, id: dbId });
                            if (result) {
                                dbId = dbId + 1
                            } else {
                                break;
                            } 
                        }
                        let finalId = dbId.toString();

                        // Store in DB
                        note.create({ header: header, content: noteContent, user: user.id, id: finalId })

                        // reply
                        await sendMessage("🌍 Note created successfully");
                break;
                case "delete":
                    const id = options.getString("id");
                    if(id === "ALL") {
                        const allData = await note.find({user: user.id});
                        if (!allData) return sendMessage("⚠️ You have no notes")
                        await note.deleteMany({ user: user.id });
                        await sendMessage("🌍 All notes deleted successfully");
                    } else {
                        const idnote = await note.findOne({ user: user.id, id: id });
                        if (!idnote) return sendMessage("🌍 This ID is not valid");
                        await note.findOneAndDelete({ user: user.id, id: id });
                        await sendMessage("🌍 Note deleted successfully");
                    }
                break;
                case "view":
                    const viewData = await note.find({ user: user.id });
                    if (viewData.length == 0) return sendMessage("⚠️ You have no notes")

                    var str = "📋 Notes:\n\n";
                    await viewData.forEach(note => {
                        str += `**${note.header}** (🪪 ID: \`${note.id}\`)\n\`${note.content}\`\n\n`
                    })

                    if (str.length >= 2000) return await sendMessage("⚠️ Your notes are to long...\n run `/notes clear \"ALL\"` to clear them")
                    await sendMessage(str);
                break;
            }
        }
}