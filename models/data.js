const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    // types of data we want
    name: String,
    userID: String,
    money: Number,
    specialTickets: Number,
    xp: Number,
    xpNeeded: Number,
    level: Number,
    daily: Number,
    weekly: Number,
    training: Number,
    isPlaying: false,
    pulls: Number,
    challengesWon: Number,
    challengesLost: Number,
    raidBosses: Number,
    characters: [ {
        name: String,
        id: Number,
        exp: Number,
        rarity: Number,
        expNeeded: Number,
        level: Number,
        attack: Number,
        hp: Number,
        weapon: String,
        thumbnail: String,
        image: String,
        description: String
        }],
    team: [Number],
    teamPower: Number,
    pfp: Number,
    favorite: Number
})

module.exports = mongoose.model("Data", dataSchema);