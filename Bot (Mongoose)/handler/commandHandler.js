const { SlashCommandBuilder } = require("discord.js");

function loadCommands(c) {
    const fs = require("fs");

    let commandsArray = [];

    const commandsFolder = fs.readdirSync("./commands");
    for( const folder of commandsFolder ) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith(".js"));

        for( const file of commandFiles ) {
            const commandFile = require(`../commands/${folder}/${file}`)

            const properties = { folder, ...commandFile};
            c.commands.set(commandFile.data.name, properties)

            if (commandFile.data instanceof SlashCommandBuilder) {
                commandsArray.push(commandFile.data.toJSON())
            } else {
                commandsArray.push(commandFile.data);
            }

            continue;
        }
    }
    c.on("ready", () => {
        c.application.commands.set(commandsArray);
    });

    return console.log(`[INFO] Loaded ${commandsFolder.length} folders of commands`);
}

module.exports = { loadCommands };