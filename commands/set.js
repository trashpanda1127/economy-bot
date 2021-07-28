const mongoose = require("mongoose");
const botconfig = require("../botconfig.json");
const Discord = require("discord.js");

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
        const idToAdd = parseInt(args[2]) // check if null
        if (!idToAdd) {
            // Check team empty
            if (isNaN(idToAdd)) {
                message.reply('please enter a number');
                return;
            }
        }

        // Look for id
        if (data.characters.length === 0) {
            message.reply('you do not have any characters');
            return;
        }
        // Check if they own character
        for (let i = 0; i < data.characters.length; i++) {
            if (data.characters[i].id === idToAdd) {
                if (data.pfp === 0) {
                    data.pfp = idToAdd;
                    message.reply(`${data.characters[i].name} is now your current fighter for challenges`)
                    data.save().catch(err => console.log(err));
                    return;
                } else if (data.pfp !== idToAdd) {
                    data.pfp = idToAdd;
                    message.reply(`${data.characters[i].name} is now your current fighter for challenges`);
                    data.save().catch(err => console.log(err));
                    return;
                } else {
                    message.reply(`${data.characters[i].name} is already your current fighter`);
                    return;
                }
            }
        }
        message.reply('You do not own the character');
        return;
    });
}

module.exports.help = {
    name: "set",
    aliases: ["set"]
}