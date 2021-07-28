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
const { db } = require("../models/data.js");
let isLeveled = false;
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
        else if(data.money < 300) {
            let WarningEmbed = new Discord.MessageEmbed()
            .setColor('#D62828')
            .setDescription(`You only have ${data.money} ..`)
            .setThumbnail("https://i.pinimg.com/564x/4a/0c/ae/4a0cae4a3399dfea40785c5eabd3eb75.jpg");
            message.channel.send(WarningEmbed)
            return;
        }
        /* WIP ------------------------*/
        // Random card
        let rewards = [2, 3, 4, 5, 6]; // 3, 4, 5, 6 Stars
        let likelihoods = [10,7,6,2,1];
        let result = rewards[calculateRarity(likelihoods)];
        // Look for chracters with rarity
        let card;
    
         switch(result) {
            case 2: card = randomCard(two_star); break;
            case 3: card = randomCard(three_star); break;
            case 4: card = randomCard(four_star); break;
            case 5: card = randomCard(five_star); break;
            case 6: card = randomCard(six_star); break;
        } 
        const { name, id, rarity, thumbnail, image, attack, hp , description} = card;
        // Check if user has the card
        /* 
            id: Number,
            exp: Number,
            level: Number,
            attack: Number,
            hp: Number,
        */
       let dupeTickets = 0;
       if (rarity === 2) dupeTickets = 2;
       if (rarity === 3) dupeTickets = 10;
       if (rarity === 4) dupeTickets = 20;
       if (rarity === 5) dupeTickets = 40;
       if (rarity === 6) dupeTickets = 100;

       data.pulls += 1;
        for (let i = 0; i < data.characters.length; i++) {
            if (data.characters[i].id === id) {
                if (data.level <= 200) {
                    data.xp += 10;
                    if (data.xp >= data.xpNeeded) {
                        data.level += 1;
                        data.xp = data.xp - data.xpNeeded;
                        data.xpNeeded = data.xpNeeded += 100;
                        isLeveled = true;
                        message.channel.send(`**${data.name} is now level ${data.level}!**`);
                    }
                }
                let WarningEmbed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle(name) // {c_characters[0].name JSON.stringify(randomCard(c_characters).name) 
                .setDescription(`*${description}*`)
                .addFields(
                    { name: '⚔️ **Attack**', value: `${attack}`, inline: true },
                    { name: '❤️  **Health**', value: `${hp}`, inline: true },
                )
                .setThumbnail(thumbnail)
                .setImage(image)
                WarningEmbed.setFooter(`${data.name} already owns this card (+${dupeTickets} ramen coupons) \n(id: ${id})`, message.author.displayAvatarURL())
                message.channel.send(WarningEmbed)
                data.specialTickets += dupeTickets;
                data.save().catch(err => console.log(err));
                return;
            }
        };
        data.characters.push({ name: name, id: id, rarity: rarity, exp: 0, expNeeded: 100, level: 1, attack: attack, hp: hp, weapon: "none", thumbnail: thumbnail, image: image, description: description});
        
        if (data.level <= 200) {
            data.xp += 10;
            if (data.xp >= data.xpNeeded) {
                data.level += 1;
                data.xp = data.xp - data.xpNeeded;
                data.xpNeeded = data.xpNeeded + 100;
                isLeveled = true;
                message.channel.send(`**${data.name} is now level ${data.level}!**`);
            }
        }
        data.save().catch(err => console.log(err));
        let WarningEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(name) // {c_characters[0].name JSON.stringify(randomCard(c_characters).name) 
            .setDescription(`*${description}*`)
            .addFields(
                { name: '⚔️ **Attack**', value: `${attack}`, inline: true },
                { name: '❤️  **Health**', value: `${hp}`, inline: true },
            )
            .setThumbnail(thumbnail)
            .setImage(image);
        WarningEmbed.setFooter(`${data.name} pulled a new card! \n(id: ${id})`, message.author.displayAvatarURL())
        message.channel.send(WarningEmbed)
        return;
    });
}


function calculateRarity(chances) {
    let sum = 0;
    chances.forEach(function(chance) {
        sum += chance;
    });
    let rand = Math.random();
    let chance = 0;
    for (let i = 0; i<chances.length; i++) {
        chance += chances[i]/sum;
        if (rand < chance) {
            return i;
        }
    }

    return -1;
}

function randomCard(arr) { // Randomly select from characters within rarity
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports.help = {
    name: "pull",
    aliases: ["p", "sum"],
}