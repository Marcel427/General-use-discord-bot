function loadEvents(c) {
    const fs = require("fs");

    const folders = fs.readdirSync("./events");
    for( const folder of folders ) {
        const files = fs.readdirSync(`./events/${folder}`).filter((file) => file.endsWith(".js"));

        for( const file of files ) {
            const event = require(`../events/${folder}/${file}`)

            if(event.rest) {
                if(event.once)
                c.rest.once(event.name, (...args) =>
                event.execute(...args, c))
                else
                c.rest.on(event.name, (...args) => 
                event.execute(...args, c))
            } else {
                if(event.once)
                c.once(event.name, (...args) => event.execute(...args, c))
                else c.on(event.name, (...args) => event.execute(...args, c))
            }
            continue;
        };
    };
    return console.log(`[INFO] Loaded ${folders.length} folders of events`);
};

module.exports = { loadEvents }