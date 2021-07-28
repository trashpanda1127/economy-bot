const mongoose = require("mongoose");
const botconfig = require("../botconfig.json");
const Discord = require("discord.js");
//const { characters, c_characters, b_characters, a_characters, s_characters, ss_characters } = require('../DB/loadData');
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
        if (!data) {
            const newData = new Data({
                name: message.author.username,
                userID: message.author.id,
                money: 0,
                specialTickets: 0,
                xp: 0,
                xpNeeded: 20,
                level: 1,
                daily: 0,
                weekly: 0,
                training: 0,
                pulls: 0,
                challengesWon: 0,
                challengesLost: 0,
                raidBosses: 0,
                characters: [],
                team: [],
                teamPower: 0,
                pfp: 0,
                favorite: 0
            })
            newData.money += 1000;
            newData.specialTickets += 100;
            newData.save().catch(err => console.log(err));
            // success command
            let SuccessEmbed = new Discord.MessageEmbed()
            .setColor("#F4E285")
            .setTitle("Account Created!!")
            .setDescription("You have been given some resources to begin")
            .addField('Fishcakes', '🍥 -> 1000', true)
            .addField('Ramen coupons', '♨️ -> 100', true)
            .setThumbnail(message.author.displayAvatarURL())
            .setAuthor(message.author.username);
            // Send to channel
            message.channel.send(SuccessEmbed);
            return; 
            }
        else {
            let WarningEmbed = new Discord.MessageEmbed()
            .setColor('#BC4B51')
            .setDescription('You already started bruh');
            message.channel.send(WarningEmbed)
            return;
        }
    });
}

module.exports.help = {
    name: "start",
    aliases: ["s"],
}