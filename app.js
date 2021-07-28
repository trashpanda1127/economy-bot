// npx nodemon
// npx prettier --write .

const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs"); 
const botconfig = require("./botconfig.json");
const prefix = botconfig.prefix;
//const prefix = '. ';

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();


fs.readdir("./commands/", (err, files) => { // read commands from folder
    if (err) console.log(err);

    let jsFile = files.filter(f => f.split(".").pop() === "js");
    if (jsFile.length <= 0) {
        return console.log("no commands found");
    }

    jsFile.forEach((f) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded`);
        client.commands.set(props.help.name, props);

        props.help.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});

client.on("ready", async () => {
    console.log(`${client.user.username} is online on ${client.guilds.cache.size} servers!`);
    client.user.setActivity(`with ${client.guilds.cache.size} servers!`)
});


client.on('message', async (message) =>  { 
    if (message.content.startsWith(prefix)) { // starts with prefix
        // requesting command 
        /*
        let args = message.content.substr(prefix.length) // take everything except prefix
            .toLowerCase()
            .split(" "); // turn into array - ["say", "hello"]  */
        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let command;
        let cmd = args.shift().toLowerCase();
        if (client.commands.has(cmd)) {
            command = client.commands.get(cmd);
        } else if (client.aliases.has(cmd))  {
            command = client.commands.get(client.aliases.get(cmd));
        }

        try {
            command.run(client, message, args);
        } catch (e) {
            console.log(args)
            return;
            }

        }
})

client.login(botconfig.token);
