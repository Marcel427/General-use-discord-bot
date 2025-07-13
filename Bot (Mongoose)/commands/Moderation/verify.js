const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, MessageFlags, ChannelType, ButtonBuilder, ButtonStyle } = require("discord.js");
const verify = require("../../schemas/verify")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Create a verify message")
    .addSubcommand(subcommand => subcommand
        .setName("setup")
        .setDescription("setup the verification system")
        .addRoleOption(option => option
            .setName("verify-role")
            .setDescription("Add a verification role")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("rules")
            .setDescription("Add custom rules if you want to (Type \"SPACE\" to break a line)")
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName("disable")
        .setDescription("Disable the verification system")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, c) {
        const sub = interaction.options.getSubcommand();

        const data = await verify.findOne({ guild: interaction.guild.id });

        async function sendMessage(message, ephemeral) {
            const embed = new EmbedBuilder()
            .setColor(c.config.color)
            .setDescription(message)

            if (ephemeral === "true") {
                interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            } else if(ephemeral === "false") {
                interaction.reply({ embeds: [embed] });
            }
        }

        switch (sub) {
            case "setup":
                if (data) return sendMessage("⚠️ The verification system has already been setup\nremove it by using the following command: `/verify disable`", "true");
                const role = interaction.options.getRole("verify-role");
                let msg = interaction.options.getString("rules") || [
                    "1. Be respectful and friendly.",
                    "2. No spamming, advertising, or trolling.",
                    "3. No harassment or bullying.",
                    "4. Do not break any rules in the server chat.",
                    "5. Follow the Discord Community Guidelines.",
                    "\nIf you press the **`Accept`** button down below you agree to the Terms of service and rules"
                ].join("\n");

                if (msg.includes("SPACE")) {
                        msg = msg.replace(/SPACE/g, "\n");
                }

                let rules = new EmbedBuilder()
                .setTitle("Rules")
                .setDescription(msg)
                .setTimestamp()
                .setFooter({ text: c.user.username})
                .setThumbnail(interaction.guild.iconURL())
                .setColor(c.config.color);

                const acceptButton = new ButtonBuilder()
                .setCustomId("accept")
                .setEmoji("✅")
                .setStyle(ButtonStyle.Success)
                .setLabel("Accept")

                const denyButton = new ButtonBuilder()
                .setCustomId("deny")
                .setEmoji("❌")
                .setStyle(ButtonStyle.Danger)
                .setLabel("Deny")

                const ar = new ActionRowBuilder().addComponents(acceptButton, denyButton)

                const message = await interaction.channel.send({ embeds: [rules], components: [ar] });
                await verify.create({
                    role: role.id,
                    guild: interaction.guild.id,
                    msg: message.id
                });
                sendMessage("🌍 The verification system has been setup", "true")
            break;

            case "disable":
                if (!data) return sendMessage("⚠️ The verification system has not been setup\nsetup it by using the following command: `/verify setup`", "true");

                await verify.deleteOne({ guild: interaction.guild.id });
                sendMessage("🌍 The verification system has been disabled", "true");
            break;
        }
    }
}

