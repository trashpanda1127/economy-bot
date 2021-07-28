const mongoose = require("mongoose");
const botconfig = require("../botconfig.json");
const Discord = require("discord.js");
const ms = require("parse-ms");

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
            let WarningEmbed = new Discord.MessageEmbed()
            .setColor('#D62828')
            .setDescription('User have not started yet')
            .setThumbnail("https://i.pinimg.com/564x/4a/0c/ae/4a0cae4a3399dfea40785c5eabd3eb75.jpg");
            message.channel.send(WarningEmbed)
            return;
        }
        if (Math.floor(86400000 - (new Date().getTime() - data.daily) > 0)) { // Millisec
            let time = ms(86400000 - (new Date().getTime() - data.daily));
            let WarningEmbed = new Discord.MessageEmbed()
            .setColor("#89023E")
            .setDescription(`**${data.name}**, you can claim again in **${time.hours}h, ${time.minutes}m, and ${time.seconds}s**`);
            message.channel.send(WarningEmbed);
            return;
        }
        data.money += 500; // add 500

        // update last claim
        data.daily = new Date().getTime();
        data.save().catch(err => console.log(err));

        let SuccessEmbed = new Discord.MessageEmbed()
        .setAuthor("🏴 Daily Rewards 🏴", message.author.displayAvatarURL())
        .setDescription(`**${message.author.username}**, you received daily **2500 money, 500 special tickets **`)
        .setColor('#D4B2D8')
        //.setThumbnail("https://i.pinimg.com/564x/4a/0c/ae/4a0cae4a3399dfea40785c5eabd3eb75.jpg");
        message.channel.send(SuccessEmbed);
        return;
    });
}

module.exports.help = {
    name: "daily",
    aliases: ["d", "day"],
}
