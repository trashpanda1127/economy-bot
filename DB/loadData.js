const path = require('path');
const fs = require('fs');

const characters = JSON.parse(fs.readFileSync(path.join(__dirname, './characters.json')));
const two_star = characters.filter(el => el.rarity == 2);
const three_star = characters.filter(el => el.rarity == 3);
const four_star = characters.filter(el => el.rarity == 4);
const five_star = characters.filter(el => el.rarity == 5);
const six_star = characters.filter(el => el.rarity == 6);
const probabilities = JSON.parse(fs.readFileSync(path.join(__dirname, './probabilities.json')));

module.exports = {
    characters,
    two_star,
    three_star,
    four_star,
    five_star,
    six_star,
    probabilities
};