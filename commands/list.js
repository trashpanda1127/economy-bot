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


module.exports.run = async (client, message, args) => { 
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
        if (!command) { // List all characters owned
            // Check if any characters owned
            if (data.characters.length === 0) {
                message.reply('You do not own any characters')
                return;
            }
            const pages = [];
            // Sort the array of characters by rarity (highest to lowest)
            data.characters.sort((a,b) => (a.rarity < b.rarity) ? 1: -1);
            
            for(let i = 0; i < data.characters.length; i++) {
                //const idToCheck = data.characters.find(el => el.id === data.team[i]);
                pages[i] = { name:'page' + i,
                             content: new Discord.MessageEmbed({
                                color: 'RANDOM',
                                title: data.characters[i].name,
                                description: `${data.characters[i].description}`,
                                fields: [
                                    {name: `Level: ${data.characters[i].level}`, value: `${data.characters[i].exp} / ${data.characters[i].level * 100}XP`},
                                    { name: '⚔️ **Attack**', value: `${data.characters[i].attack}`, inline: true },
                                    { name: '❤️ **Health**', value: `${data.characters[i].hp}`, inline: true },
                                    { name: '**Weapon**', value: `${data.characters[i].weapon}` }
                                ],
                                image: { url: data.characters[i].image },
                                thumbnail: { url: data.characters[i].thumbnail },
                                footer: { text: `(id: ${data.characters[i].id}) -- ${i + 1}/${data.characters.length} characters`, icon_url: message.author.displayAvatarURL()}
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
        // List (C/B/A/S/SS) -> List characters of a certain rarity args[2]
        command.toLowerCase();
        const pages = [];
        if (command === "c" || command === "b" || command === "a" || command === "s" || command === "ss") {
            let rarity = 0;
                switch (command) {
                    case 'c': 
                        rarity = 2;
                        break;
                    case 'b': 
                        rarity = 3;
                        break;
                    case 'a': 
                        rarity = 4;
                        break;
                    case 's': 
                        rarity = 5;
                        break;
                    case 'ss': 
                        rarity = 6;
                        break;
                    default:
                        message.channel.send('Enter a rarity (C/B/A/S/SS)');
                        return;
                }
            let selectedRarity = data.characters.filter(el => {
                return el.rarity === rarity;
            })

            if (selectedRarity.length === 0) {
                message.channel.send(`You do not own any ${command.toUpperCase()} characters`);
                return;
            }

            for(let i = 0; i < selectedRarity.length; i++) {
                //const idToCheck = data.characters.find(el => el.id === data.team[i]);
                pages[i] = { name:'page' + i,
                             content: new Discord.MessageEmbed({
                                color: 'RANDOM',
                                title: selectedRarity[i].name,
                                description: `${data.characters[i].description}`,
                                fields: [
                                    { name: `Level ${selectedRarity[i].level}`, value: `${selectedRarity[i].exp} / ${selectedRarity[i].level * 100}XP`},
                                    { name: '⚔️ **Attack**', value: `${selectedRarity[i].attack}`, inline: true },
                                    { name: '❤️ **Health**', value: `${selectedRarity[i].hp}`, inline: true },
                                    { name: '**Weapon**', value: `${selectedRarity[i].weapon}` }
                                ],
                                image: { url: selectedRarity[i].image },
                                thumbnail: { url: selectedRarity[i].thumbnail },
                                footer: { text: `id: ${selectedRarity[i].id} -- ${i+1}/${selectedRarity.length} characters`, icon_url: message.author.displayAvatarURL()}
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

        // List all -> including unowned characters
        if (args[2] === "all") {
            if (!args[3]) { // list all characters
                // Sort 
                characters.sort((a,b) => (a.rarity < b.rarity) ? 1: -1);
                
                for(let i = 0; i < characters.length; i++) {
                    //console.log(findChar)

                    pages[i] = { name:'page' + i,
                                 content: new Discord.MessageEmbed({
                                    color: 'RANDOM',
                                    title: characters[i].name,
                                    description: `${data.characters[i].description}`,
                                    fields: [
                                        { name: '⚔️ **Attack**', value: `${characters[i].attack}`, inline: true },
                                        { name: '❤️ **Health**', value: `${characters[i].hp}`, inline: true },
                                    ],
                                    image: { url: characters[i].image },
                                    thumbnail: { url: characters[i].thumbnail },
                                    footer: { text: `(id: ${characters[i].id}) -- ${i + 1}/${characters.length} characters`, icon_url: message.author.displayAvatarURL()}
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
            // List all (C/B/A/S/SS)
            if (args[3] === "c" || args[3] === "b" || args[3] === "a" || args[3] === "s" || args[3] === "ss") {
                let rarity = 0;
                    switch (args[3]) {
                        case 'c': 
                            rarity = 2;
                            break;
                        case 'b': 
                            rarity = 3;
                            break;
                        case 'a': 
                            rarity = 4;
                            break;
                        case 's': 
                            rarity = 5;
                            break;
                        case 'ss': 
                            rarity = 6;
                            break;
                        default:
                            message.channel.send('Enter a rarity (C/B/A/S/SS)');
                            return;
                    }
                let selectedRarity = characters.filter(el => {
                    return el.rarity === rarity;
                });
                
                for(let i = 0; i < selectedRarity.length; i++) {

                    pages[i] = { name:'page' + i,
                                 content: new Discord.MessageEmbed({
                                    color: 'RANDOM',
                                    description: `${data.characters[i].description}`,
                                    title: selectedRarity[i].name,
                                    fields: [
                                        { name: '⚔️ **Attack**', value: `${selectedRarity[i].attack}`, inline: true },
                                        { name: '❤️ **Health**', value: `${selectedRarity[i].hp}`, inline: true },
                                    ],
                                    image: { url: selectedRarity[i].image },
                                    thumbnail: { url: selectedRarity[i].thumbnail },
                                    footer: { text: `(id: ${selectedRarity[i].id}) -- ${i + 1}/${selectedRarity.length} characters`, icon_url: message.author.displayAvatarURL()}
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
    }
    
    });
}
 
module.exports.help = {
    name: "list",
    aliases: ["li"],
}