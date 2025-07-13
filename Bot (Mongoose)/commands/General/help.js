const { ComponentType, EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get a help menu with commands and information"),

    async execute(interaction, c) {
        const emojis = {
            admin: "⚠️",
            general: "📄",
            economy: "🏦",
            moderation: "🛠️",
            ticketsystem: "🎫",
            giveaway: "🎁",
            automoderation: "🧰",
            globalbansystem: "🌍",
            antiraidsystem: "🚨",
        }

        const directories = [
            ...new Set(interaction.client.commands.map((cmd) => cmd.folder)),
        ];

        const formatString = (str) => 
        `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((dir) => {
            const getCommands = interaction.client.commands
            .filter((cmd) => cmd.folder === dir)
            .map((cmd) => {
                return {
                    name: `/`+cmd.data.name,
                    description:
                    `${cmd.data.description || "N/A"}`,
                };
            });

            return {
                directory: formatString(dir),
                commands: getCommands,
            };
        });
        const embed = new EmbedBuilder()
        .setTitle("**__"+c.user.username+" Help-Menu__**")
        .setThumbnail(c.user.avatarURL())
        .setDescription([
            "Choose a category from the drop-down menu\n",
			"You can choose between:\n```General, Economy, Moderation, Ticketsystem, Giveaway, Admin, Automoderation, Globalban, AntiRaidsystem```\n",
            "-# If you need help with bot issues join the [Cordinal Services Discord](https://discord.gg/Y3hdgTfjGq)"
        ].join("\n"))
        .addFields(
            { name: "**TOS**", value: "By using this bot you agree to the [Terms of Service](https://docs.google.com/document/d/1vhsob_B3nZGpA2-CFYXVkBVeb1wqIVMZfC8n2tTB3jQ/edit?usp=sharing)", inline: true },
            { name: "**Privacy Policy**", value: "By using this bot you agree to the [Privacy Policy](https://docs.google.com/document/d/136jQ5VB1r4JpCs2EOwsfQqv7t--oJp_9tb1PWtRtMhk/edit?usp=sharing)", inline: true }
        ) .setImage("https://cdn.discordapp.com/attachments/1213953809957654598/1372608159633379408/Download.png?ex=68276477&is=682612f7&hm=936086efb875e4388999ca9c7c878595d22765b4f0ffe36a0096aaf456c6b269&")
        .setColor(c.config.color)
        .setFooter({ text: `Send by ${c.user.username}`, iconURL: c.user.avatarURL() })
        .setTimestamp()

        const components = (state) => [
            new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                .setCustomId("help-menu")
                .setPlaceholder("Select a command category for help")
                .setDisabled(state)
                .addOptions(
                    categories.map((cmd) => {
                        return {
                            label: cmd.directory,
                            value: cmd.directory.toLowerCase(),
                            description: `All commands of the category ${cmd.directory}`,
                            emoji: emojis[cmd.directory.toLowerCase()] || "🎫"
                        }
                    })
                )
            ),
        ];

        const initialMessage = await interaction.reply({
            embeds: [embed],
            components: components(false),
            flags: MessageFlags.Ephemeral,
        })

        const filter = (interaction) =>
        interaction.user.id === interaction.member.id;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.StringSelect
        });

        collector.on("collect", (interaction) => {
            const [directory] = interaction.values;
            const category = categories.find(
                (x) => x.directory.toLowerCase() === directory
            );

            const categoryEmbed = new EmbedBuilder()
            .setTitle(`${formatString(directory)} Commands`)
            .setColor(c.config.color)
            .setDescription(`A list of all commands of the category **${directory}**`)
            .setFooter({ text: `Send by ${c.user.username}`, iconURL: c.user.avatarURL() })
            .setTimestamp()
            .addFields(
                category.commands.map((cmd) => {
                    return {
                        name: `\`${cmd.name}\``,
                        value: cmd.description,
                        inline: true
                    };
                })
            );
            interaction.update({ embeds: [categoryEmbed], flags: MessageFlags.Ephemeral });
        })

        collector.on("end", () =>{
            initialMessage.edit({ components: components(true), flags: MessageFlags.Ephemeral })
        });
    }
};