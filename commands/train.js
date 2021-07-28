const mongoose = require("mongoose");
const botconfig = require("../botconfig.json");
const Discord = require("discord.js");
const fs = require('fs');
const path = require('path');
const { Menu } = require('discord.js-menu');

const enemies = JSON.parse(fs.readFileSync(path.join(__dirname, '../DB/enemy.json')));
// const three_star = characters.filter(el => el.rarity == 3);
//connect to db
mongoose.connect(botconfig.mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const Data = require("../models/data.js");

// "z train [1-10?]" level characters

let playerHp, playerAtk, charId;
let enemy = {
    name: "",
    level: 0,
    atk: 0,
    hp: 0,
    maxHp: 0,
    expGiven: 0,
    moneyGiven: 0,
    image: "",
    description: ""
}

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

        if (data.pfp <= 0) {
            message.reply('Select a fighter using "z set <id>');
            return;
        }
        // split message
        let args = message.content.split(' ');

        // Check args
        const command = args[1] // check if null, number
        if (!command) { 
            // No number specified
            message.reply('enter a number');
            return;
        }
        let difficulty = parseInt(args[2]);
        if (isNaN(difficulty)) {
            message.reply('enter a number')
            return
        }
        
        // Check if player has already started another command
        if (data.isPlaying) {
            let WarningEmbed = new Discord.MessageEmbed()
            .setColor('#D62828')
            .setDescription('You are already training')
            message.channel.send(WarningEmbed)
            return;
        }
        data.isPlaying = true;
        // Set enemy depending on difficulty selected
        if (difficulty === 1) { // Level 1-5
            selectDifficulty(enemy, difficulty, 1);
            enemy.atk = randomNum(200, 300);
            enemy.expGiven = randomNum(60, 80);
            enemy.moneyGiven = randomNum(20, 30); 
            enemy.maxHp = randomNum(2000,3000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 2) { // Level 5-10
            selectDifficulty(enemy, difficulty, 10);
            enemy.atk = randomNum(400, 550);
            enemy.expGiven = randomNum(150, 200);
            enemy.moneyGiven = randomNum(30, 40); 
            enemy.maxHp = randomNum(6000,7000);
            enemy.hp = enemy.maxHp
        }      
        if (difficulty === 3) {
            selectDifficulty(enemy, difficulty, 15);
            enemy.atk = randomNum(700, 850);
            enemy.expGiven = randomNum(200, 250);
            enemy.moneyGiven = randomNum(60, 80); 
            enemy.maxHp = randomNum(10000,14000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 4) {
            selectDifficulty(enemy, difficulty, 20);
            enemy.atk = randomNum(1000, 1200);
            enemy.expGiven = randomNum(300, 350);
            enemy.moneyGiven = randomNum(80, 110); 
            enemy.maxHp = randomNum(15000,17000);
            enemy.hp = enemy.maxHp
           } 
        if (difficulty === 5) {
            selectDifficulty(enemy, difficulty, 25);
            enemy.atk = randomNum(1400, 1500);
            enemy.expGiven = randomNum(350, 375);
            enemy.moneyGiven = randomNum(120, 150); 
            enemy.maxHp = randomNum(18000,20000);
            enemy.hp = enemy.maxHp
           }
        if (difficulty === 6) {
            selectDifficulty(enemy, difficulty, 30);
            enemy.atk = randomNum(1700, 1920);
            enemy.expGiven = randomNum(380, 385);
            enemy.moneyGiven = randomNum(150, 155); 
            enemy.maxHp = randomNum(20000,21000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 7) {
            selectDifficulty(enemy, difficulty, 35);
            enemy.atk = randomNum(2000, 2350);
            enemy.expGiven = randomNum(400, 410);
            enemy.moneyGiven = randomNum(160, 165); 
            enemy.maxHp = randomNum(23000,24000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 8) {
            selectDifficulty(enemy, difficulty, 40);
            enemy.atk = randomNum(2500, 2720);
            enemy.expGiven = randomNum(420, 430);
            enemy.moneyGiven = randomNum(170, 175); 
            enemy.maxHp = randomNum(25000,26000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 9) {
            selectDifficulty(enemy, difficulty, 45);
            enemy.atk = randomNum(3000, 3400);
            enemy.expGiven = randomNum(435, 440);
            enemy.moneyGiven = randomNum(180, 190); 
            enemy.maxHp = randomNum(30000,32000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 10) {
            selectDifficulty(enemy, difficulty, 50);
            enemy.atk = randomNum(3500, 3700);
            enemy.expGiven = randomNum(450, 455);
            enemy.moneyGiven = randomNum(200, 220); 
            enemy.maxHp = randomNum(40000,41000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 11) {
            selectDifficulty(enemy, difficulty, 55);
            enemy.atk = randomNum(3800, 4200);
            enemy.expGiven = randomNum(450, 455);
            enemy.moneyGiven = randomNum(200, 220); 
            enemy.maxHp = randomNum(43000,45000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 12) {
            selectDifficulty(enemy, difficulty, 60);
            enemy.atk = randomNum(4550, 4760);
            enemy.expGiven = randomNum(450, 455);
            enemy.moneyGiven = randomNum(200, 220); 
            enemy.maxHp = randomNum(40000,41000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 13) {
            selectDifficulty(enemy, difficulty, 65);
            enemy.atk = randomNum(550, 560);
            enemy.expGiven = randomNum(450, 455);
            enemy.moneyGiven = randomNum(200, 220); 
            enemy.maxHp = randomNum(40000,41000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 14) {
            selectDifficulty(enemy, difficulty, 69);
            enemy.atk = randomNum(550, 560);
            enemy.expGiven = randomNum(450, 455);
            enemy.moneyGiven = randomNum(200, 220); 
            enemy.maxHp = randomNum(40000,41000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 15) {
            selectDifficulty(enemy, difficulty, 75);
            enemy.atk = randomNum(550, 560);
            enemy.expGiven = randomNum(450, 455);
            enemy.moneyGiven = randomNum(200, 220); 
            enemy.maxHp = randomNum(40000,41000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 16) {
            selectDifficulty(enemy, difficulty, 80);
            enemy.atk = randomNum(550, 560);
            enemy.expGiven = randomNum(450, 455);
            enemy.moneyGiven = randomNum(200, 220); 
            enemy.maxHp = randomNum(40000,41000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 17) {
            selectDifficulty(enemy, difficulty, 85);
            enemy.atk = randomNum(550, 560);
            enemy.expGiven = randomNum(450, 455);
            enemy.moneyGiven = randomNum(200, 220); 
            enemy.maxHp = randomNum(40000,41000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 18) {
            selectDifficulty(enemy, difficulty, 90);
            enemy.atk = randomNum(550, 560);
            enemy.expGiven = randomNum(450, 455);
            enemy.moneyGiven = randomNum(200, 220); 
            enemy.maxHp = randomNum(40000,41000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 19) {
            selectDifficulty(enemy, difficulty, 95);
            enemy.atk = randomNum(550, 560);
            enemy.expGiven = randomNum(450, 455);
            enemy.moneyGiven = randomNum(200, 220); 
            enemy.maxHp = randomNum(40000,41000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 29) {
            selectDifficulty(enemy, difficulty, 99);
            enemy.atk = randomNum(550, 560);
            enemy.expGiven = randomNum(450, 455);
            enemy.moneyGiven = randomNum(200, 220); 
            enemy.maxHp = randomNum(40000,41000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 21) {
            selectDifficulty(enemy, difficulty, 100);
            enemy.atk = randomNum(550, 560);
            enemy.expGiven = randomNum(450, 455);
            enemy.moneyGiven = randomNum(200, 220); 
            enemy.maxHp = randomNum(40000,41000);
            enemy.hp = enemy.maxHp
        }
        if (difficulty === 22) {
            selectDifficulty(enemy, difficulty, 105);
            enemy.atk = randomNum(550, 560);
            enemy.expGiven = randomNum(450, 455);
            enemy.moneyGiven = randomNum(200, 220); 
            enemy.maxHp = randomNum(40000,41000);
            enemy.hp = enemy.maxHp
        }
        // Get current fighter info
        for (let i = 0; i < data.characters.length; i++) {
            if (data.characters[i].id === data.pfp) {
                playerHp = data.characters[i].hp;
                playerAtk = data.characters[i].attack;
                charId = i;
            }
        }
        const options = {
            limit: 90 * 1000, // 60 sec timeout
            min: 1, // Minimum page
            max: 15, // Max page, last
            page: 1 // start page
        }
        // Starting page before fighting
        let startEmbed = new Discord.MessageEmbed({
            title: `🏮  __Training ${difficulty}__  🏮`,
            fields: [
                {name: data.characters[charId].name + " Level " + data.characters[charId].level,
                value: ` Health ❤️: **(${playerHp}/${data.characters[charId].hp})**`
                },
                {
                    name: enemy.name,
                    value: enemy.description
                },
                {
                    name: `__Level__ → ${enemy.level}`,
                    value: ` **Health ❤️: (${enemy.hp}/${enemy.maxHp})**`
                }
            ],
            description: '***⚔️ - Attack\n ❌ - Quit***',
            footer: {
                text: "You have 1 minute to defeat the enemy!"
            },
            image: {
                url: enemy.image
            },
            thumbnail: {
                url: data.characters[charId].image
            }
        });

        let fightEmbed = new Discord.MessageEmbed({
            title: `🏮  __Training ${difficulty}__  🏮`,
            image: {
                url: enemy.image
            },
            thumbnail: {
                url: data.characters[charId].image
            },
            author: {
                name: data.name,
                icon_url: message.author.displayAvatarURL()
            }
        });

        // Player win
        let winEmbed = new Discord.MessageEmbed({
            title: `🏮  __Training ${difficulty}__  🏮`,
            image: {
                url: enemy.image
            },
            fields: [{
                name: data.characters[charId].name + " Level " + data.characters[charId].level,
                value: ` Health ❤️: **(${playerHp}/${data.characters[charId].hp})**`
            },
            {
                name: enemy.name + " Level " + enemy.level,
                value: ` Health ❤️: **(${enemy.hp}/${enemy.maxHp})**`
            }],
            description: `${data.characters[charId].name} defeated ${enemy.name}`,
            thumbnail: {
                url: data.characters[charId].image
            },
            author: {
                name: data.name ,
                icon_url: message.author.displayAvatarURL()
            }
        });

        // Player lose
        let loseEmbed = new Discord.MessageEmbed({
            title: `🏮  __Training ${difficulty}__  🏮`,
            image: {
                url: enemy.image
            },
            fields: [{
                name: data.characters[charId].name + " Level " + data.characters[charId].level,
                value: ` Health ❤️: **(${playerHp}/${data.characters[charId].hp})**`
            },
            {
                name: enemy.name + " Level " + enemy.level,
                value: ` Health ❤️: **(${enemy.hp}/${enemy.maxHp})**`
            }],
            description: `${data.characters[charId].name} died to ${enemy.name}!`,
            thumbnail: {
                url: data.characters[charId].image
            },
            author: {
                name: data.name,
                icon_url: message.author.displayAvatarURL()
            }
        });

        const pages = {
            1: startEmbed,
            2: fightEmbed,
            3: winEmbed,
            4: loseEmbed
        }

        message.channel.send({ embed: pages[options.page] }).then((m) => {
             m.react('⚔️');
             m.react('❌');
           
            const filter = (reaction, user) => {
                return ['⚔️', '❌'].includes(reaction.emoji.name) && user.id == message.author.id;
            };

            const removeReaction = async (m, msg, emoji) => {
                try { m.reactions.find(r => r.emoji.name == emoji).users.remove(msg.author.id); } catch(err) {}
            }

            const awaitReactions = async (message, m, options, filter) => {
                const { min, max, page, limit } = options;

                m.awaitReactions(filter, { max: 1, time: limit, errors: ['time'] })
                .then(async (collected) => {
                    // logic
                    const reaction = collected.first();

                    if (reaction.emoji.name === '⚔️') {
                        // calculate damage
                        tempAtk = randomNum(enemy.atk - 100, enemy.atk); 
                        playerAtk = randomNum(playerAtk - 100, playerAtk);
                        playerHp = Math.floor(playerHp - tempAtk);
                        enemy.hp = Math.floor(enemy.hp - playerAtk);

                            // attack
                            if (playerHp <= 0 && enemy.hp <= 0) {
                                // Player and enemy both died
                                playerHp = 0;
                                enemy.hp = 0;
                                m.reactions.removeAll();
                                pages[4].fields[0] = {
                                    name: data.characters[charId].name + " (Level " + data.characters[charId].level + ")",
                                    value: ` Health ❤️: **(${playerHp}/${data.characters[charId].hp})**`
                                }
                                pages[4].fields[1] = {
                                    name: enemy.name + " (Level " + enemy.level + ")",
                                    value: ` Health ❤️: **(${enemy.hp}/${enemy.maxHp})**`
                                }
                                //page[4].setDescription = `${data.characters[charId].name} and ${enemy.name} both died!`
                                data.isPlaying = false;
                                data.save().catch(err => console.log(err));
                                await m.edit({ embed: pages[4] });
                                return;
                            }

                            else if (playerHp <= 0) {
                                // Player died
                                playerHp = 0;
                                m.reactions.removeAll();
                                pages[4].fields[0] = {
                                    name: data.characters[charId].name + " (Level " + data.characters[charId].level + ")",
                                    value: ` Health ❤️: **(${playerHp}/${data.characters[charId].hp})**`
                                }
                                pages[4].fields[1] = {
                                    name: enemy.name + " (Level " + enemy.level + ")",
                                    value: ` Health ❤️: **(${enemy.hp}/${enemy.maxHp})**`
                                }
                                data.isPlaying = false;
                                data.save().catch(err => console.log(err));
                                await m.edit({ embed: pages[4] });
                                return;
                            }

                            else if (enemy.hp <= 0) {
                                // Enemy is dead
                                enemy.hp = 0;
                                m.reactions.removeAll();
                                pages[3].fields[0] = {
                                    name: data.characters[charId].name + " (Level " + data.characters[charId].level + ")",
                                    value: ` Health ❤️: **(${playerHp}/${data.characters[charId].hp})**`
                                }
                                pages[3].description = `${data.characters[charId].name} attacked for ${playerAtk} damage and defeated ${enemy.name}! \n
                                ${enemy.name} attacked for ${tempAtk} damage`
                                pages[3].fields[1] = {
                                    name: enemy.name + " (Level " + enemy.level + ")",
                                    value: ` Health ❤️: **(${enemy.hp}/${enemy.maxHp})**`
                                }
                                // Calculate player xp gain
                                data.characters[charId].exp += enemy.expGiven;

                                if (data.characters[charId].exp >= data.characters[charId].expNeeded) {
                                    // Level up
                                    data.characters[charId].exp = Math.abs(data.characters[charId].expNeeded - data.characters[charId].exp);
                                    data.characters[charId].level += 1;
                                    data.characters[charId].attack = Math.floor((data.characters[charId].attack * .04) + data.characters[charId].attack);
                                    data.characters[charId].hp = Math.floor((data.characters[charId].hp * .06) + data.characters[charId].hp);
                                    data.characters[charId].expNeeded = data.characters[charId].level * 150;
                                    pages[3].setFooter(`Gained ${enemy.expGiven} XP and ${enemy.moneyGiven} Currency \n${data.characters[charId].name} is now level ${data.characters[charId].level}`);
                                } else {
                                    data.characters[charId].expNeeded -= data.characters[charId].exp;
                                    pages[3].setFooter(`${data.characters[charId].name} gained ${enemy.expGiven} XP and ${enemy.moneyGiven} Currency`);
                                }
                                data.training += 1;
                                data.money += enemy.moneyGiven;
                                data.isPlaying = false;
                                data.save().catch(err => console.log(err));
                                await m.edit({ embed: pages[3] });
                                return;
                            }
                            // Attack again
                            else {
                                pages[2].fields[0] = {
                                    name: data.characters[charId].name + " (Level " + data.characters[charId].level + ")",
                                    value: ` Health ❤️: **(${playerHp}/${data.characters[charId].hp})**`
                                }
                                pages[2].fields[1] = {
                                    name: enemy.name + " (Level " + enemy.level + ")",
                                    value: ` Health ❤️: **(${enemy.hp}/${enemy.maxHp})**`
                                }
                                pages[2].setDescription(`${data.characters[charId].name} attacked ${enemy.name} for ${playerAtk} damage! \n
                                                        ${enemy.name} attacked for ${tempAtk} damage`);
                                fightEmbed.setColor('#4FB477');
                                m.reactions.removeAll();
                                m.react('⚔️');
                                m.react('❌');
                                await m.edit({ embed: pages[2] });
                            }


                        // restart listener
                        awaitReactions(message, m, options, filter);
                    }
                    else if (reaction.emoji.name === '❌') {
                        // c.
                        data.isPlaying = false;
                        data.save().catch(err => console.log(err));
                        return await m.delete();
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }
            awaitReactions(message, m, options, filter);

        })


        
       
        data.save().catch(err => console.log(err));
        return;
    });
}

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function selectDifficulty(enemy, difficultyLevel, level) {
    const currentEnemy = enemies.filter(el => el.difficulty == difficultyLevel);
    enemy.name = currentEnemy[0].name;
    enemy.level = level;
    enemy.image = currentEnemy[0].image;
    enemy.description = currentEnemy[0].description;
    return enemy;
}

module.exports.help = {
    name: "train",
    aliases: ["tr"],
}

