const mongoose = require("mongoose");
const botconfig = require("../botconfig.json");
const Discord = require("discord.js");
//connect to db
mongoose.connect(botconfig.mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const Data = require("../models/data.js");

module.exports.run = async (client, message, args) => {
    // Mentioned User
    let mentionedUser = message.mentions.members.first();
    if (mentionedUser) {
        Data.findOne({
            userID: mentionedUser.id
        }, (err, data) => {
            if (!data) {
                let WarningEmbed = new Discord.MessageEmbed()
                .setColor('#D62828')
                .setDescription('User have not started yet')
                .setThumbnail("https://i.pinimg.com/564x/4a/0c/ae/4a0cae4a3399dfea40785c5eabd3eb75.jpg");
                message.channel.send(WarningEmbed)
                return;
            }
            
            //SuccessEmbed.setDescription(`${mentionedUser.user.username} has ${UserJSON[mentionedUser.id].bal}`);
            let SuccessEmbed = new Discord.MessageEmbed()
            .setColor("#32746D")
            .setTitle(`${data.name}'s balance`)
            .setDescription(`\n🍥 **money =  ${data.money} \n special = aaa **`)
            .setThumbnail("https://i.pinimg.com/564x/69/1f/c9/691fc99d59e31a90bddfef7b455fdd3e.jpg") // change to profile pic set by user
            message.channel.send(SuccessEmbed);
            return; 
        })
    }
    else {
        Data.findOne({
            userID: message.author.id 
        }, (err, data) => {
            if (!data) {
                let WarningEmbed = new Discord.MessageEmbed()
                .setColor('#D62828')
                .setDescription('You have not started yet')
                .setThumbnail("https://i.pinimg.com/564x/4a/0c/ae/4a0cae4a3399dfea40785c5eabd3eb75.jpg");
                message.channel.send(WarningEmbed)
                return;
            } else {   
                let SuccessEmbed = new Discord.MessageEmbed()
                .setColor("#32746D")
                .setTitle(`${message.author.username}'s balance`)
                .setDescription(`\n🍥 **money =  ${data.money}\n special = aaa **`)
                .setThumbnail(message.author.displayAvatarURL())
                message.channel.send(SuccessEmbed);
                return; 
            }
        });
    }
}


module.exports.help = {
    name: "balance",
    aliases: ["bal", "b"],
}