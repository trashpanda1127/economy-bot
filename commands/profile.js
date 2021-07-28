const mongoose = require("mongoose");
const botconfig = require("../botconfig.json");
const Discord = require("discord.js");
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
        let xpPercent = (data.xp/data.xpNeeded) * 100;
        xpPercent = xpPercent.toFixed(2);
        let fav = data.characters.find(el => el.id === data.favorite);
        let fighter = data.characters.find(el => el.id === data.pfp);
        let profileEmbed = new Discord.MessageEmbed()
        .setColor('RANDOM')
            .setThumbnail(message.author.displayAvatarURL()) // Change to pfp
            .setAuthor(`${data.name}'s profile`, message.author.displayAvatarURL())
            .addFields(
                { name: '💫 Level', value: `${data.level}  (${xpPercent}%)`, inline: true},
                { name: '🍥 Fishcakes', value: data.money, inline: true },
                { name: '♨️ Ramen Coupons', value: data.specialTickets, inline: true },
                { name: '\u200B', value: '**Stats**' },
                { name: '⌛ Training completed', value: data.training, inline: true },
                { name: '🌀 Summons', value: data.pulls, inline: true },
                { name: '💀 Bosses defeated', value: data.raidBosses, inline: true },
                { name: '🗡️ Challenges won', value: data.challengesWon, inline: true},
                { name: '🛡️ Challenges lost', value: data.challengesLost, inline: true },
                { name: '👥 Characters owned', value: `${data.characters.length}/${characters.length}`, inline: true },
            )
            .setTimestamp()
        if (data.pfp !== 0) {
            profileEmbed.setThumbnail(fighter.image);
            profileEmbed.addFields({ name: '🏮 Current fighter', value: `${fighter.name} (LV. ${fighter.level})`})
        }
        if (data.favorite !== 0) {
            profileEmbed.addFields({ name: '⭐ Favorite character', value: `${fav.name} (LV. ${fav.level})`, inline: true})
            profileEmbed.setImage(fav.image);
            profileEmbed.setFooter(`id: ${data.favorite}`)
        }
        message.channel.send(profileEmbed);
        return;
    });

}

module.exports.help = {
    name: "profile",
    aliases: ["pr"]
}