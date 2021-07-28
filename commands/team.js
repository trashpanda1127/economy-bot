const mongoose = require("mongoose");
const botconfig = require("../botconfig.json");
const Discord = require("discord.js");
const recon = require("reconlx");
const { Menu } = require('discord.js-menu');
const ReactionPages = recon.ReactionPages;
const { characters, two_star, three_star, four_star, five_star, six_star, probabilities } = require('../DB/loadData');

//connect to db
mongoose.connect(botconfig.mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const Data = require("../models/data.js");


module.exports.run = async (client, message, args) => { // team add 3 .. args[1] === addm args[2] === id
    Data.findOne({
        userID: message.author.id 
    }, (err, data) => {
        // Check if user started game
        if (!data) {
            let WarningEmbed = new Discord.MessageEmbed()
            .setColor('#D62828')
            .setDescription('User have not started yet')
            .setThumbnail("https://i.pinimg.com/564x/4a/0c/ae/4a0cae4a3399dfea40785c5eabd3eb75.jpg");
            message.channel.send(WarningEmbed)
            return;
        }
        // split message
        let args = message.content.split(' ');

        // Check args
        const command = args[2] // check if null, add , or remove
        if (!command) { // List the team
            // Check team empty
            if (data.team.length === 0) {
                message.reply('Team is empty')
                return;
            }
            const pages = [];
            for(let i = 0; i < data.team.length; i++) {
                const idToCheck = data.characters.find(el => el.id === data.team[i]);
                pages[i] = { name:'page' + i,
                             content: new Discord.MessageEmbed({
                                color: '#D62828',
                                title: idToCheck.name,
                                description: `${idToCheck.description}`,
                                fields: [
                                    {name: `Level: ${idToCheck.level}`, value: `${idToCheck.exp} / ${idToCheck.level * 100}XP`},
                                    { name: '⚔️ **Attack**', value: `${idToCheck.attack}`, inline: true },
                                    { name: '❤️ **Health**', value: `${idToCheck.hp}`, inline: true },
                                    { name: '**Weapon**', value: `${idToCheck.weapon}` }
                                ],
                                image: { url: idToCheck.image },
                                thumbnail: { url: idToCheck.thumbnail },
                                footer: { text: `Team power: ${data.teamPower} \n (id: ${idToCheck.id}) - ${i + 1}/4`, icon_url: message.author.displayAvatarURL()}
                            }),
                            reactions: {
                                '⏪': 'previous',
                                '⏩': 'next'
                                }
                            }
                }
            let teamMenu = new Menu(message.channel, message.author.id, pages, 300000);
            teamMenu.start();
        return;
        }

        // Add Command
        if (command === "add") { // Add to team
            // Check if number
            const idToAdd = parseInt(args[3]);
            if (isNaN(idToAdd)) {
                message.reply('please enter a number');
                return;
            }
            // Check if team is full
            if (data.team.length > 3) {
                message.reply('Team is full 4/4');
                return;

            } 
            // Look for id
            if (data.characters.length === 0) {
                message.reply('you do not have any characters')
                return
            }

            // Search characters
            for (let i = 0; i < data.characters.length; i++) {
                if (data.characters[i].id === idToAdd) {
                    // Check if in team
                    if (data.team.length !== 0) {
                        for (let j = 0; j <= data.team.length; j++) {
                            if (data.team[j] === idToAdd) {
                                message.reply('Already in ur team');
                                return;
                            }
                        }
                    }

                    // Add to team
                    data.team.push(idToAdd);

                    // Update Team power
                    data.teamPower += data.characters[i].attack;
                    // Save data
                    data.save().catch(err => console.log(err));

                    message.reply(`${data.characters[i].name} has been added to your team. Team power is **${data.teamPower}**`);
                    return;
                } 
            }
            message.reply('you do not own this person');
            return;
        }

        // Remove Command
        if (command === "remove") { // Remove from team
            // Check if number
            const idToRemove = parseInt(args[3]);
            if (isNaN(idToRemove)) {
                message.reply('please enter a number');
                return;
            }

            // Look for id
            if (data.characters.length === 0) {
                message.reply('you do not have any characters')
                return
            }

            // Search characters
            for (let i = 0; i < data.characters.length; i++) {
                if (data.characters[i].id === idToRemove ) {
                    // Check if in team
                    if (data.team.length !== 0) {
                        for (let j = 0; j <= data.team.length; j++) {
                            if (data.team[j] === idToRemove) {
                                // Remove remove DB !!, Update Team Power, Save
                                // Update Team power
                                data.teamPower -= data.characters[i].attack;
                                data.team.splice(j, 1);
                                // Save data
                                data.save().catch(err => console.log(err));
                                message.reply(`${data.characters[i].name} will be removed. Team Power is **${data.teamPower}**`); // Remove
                                return;
                            }
                        }

                    }
                    message.reply('That ID is not in ur team')
                   // message.reply(`${data.characters[i].name} has been added to your team. Team power is **${data.teamPower}**`);
                    return;
                } 
            }
            message.reply('you do not own this person');
            return;
        }


        else {
            message.reply('Invalid Command')
            return;
        }


    
    });
}

module.exports.help = {
    name: "team",
    aliases: ["t"],
}