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
        const command = args[2];
        let idToCheck = 0;
        if (!command) { // List the current fighter
            // Check team empty
            if (data.pfp.length === 0) {
                message.reply('No selected character');
                return;
            }
            for (let i = 0; i < data.characters.length; i++) {
                if (data.characters[i].id === data.pfp) {
                    idToCheck = i;
                }
            }

            let embed = new Discord.MessageEmbed({
                color: '#D62828',
                title: data.characters[idToCheck].name,
                description: `${data.characters[idToCheck].description}`,
                fields: [
                    { name: `Level: ${data.characters[idToCheck].level}`, value: `${data.characters[idToCheck].exp} / ${data.characters[idToCheck].level * 100}XP`},
                    { name: '⚔️ **Attack**', value: `${data.characters[idToCheck].attack}`, inline: true },
                    { name: '❤️ **Health**', value: `${data.characters[idToCheck].hp}`, inline: true },
                    { name: '**Weapon**', value: `${data.characters[idToCheck].weapon}` }
                ],
                image: { url: data.characters[idToCheck].image },
                thumbnail: { url: data.characters[idToCheck].thumbnail },
                footer: { text: `(id: ${data.characters[idToCheck].id})`, icon_url: message.author.displayAvatarURL()}
            })

            message.channel.send(embed);
            return;
        }
    
        
    });
}

module.exports.help = {
    name: "fighter",
    aliases: ["current", "curr"],
}