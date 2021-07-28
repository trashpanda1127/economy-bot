# economy-bot
A discord.js economy bot based on collecting various character cards. 

## Description
- Uses discord.js to create a client that allows several commands to be input using a prefix
- The bot waits for commands to be received by users and sends various messages depending on which command it is
- MongoDB is used to store user data such as id, balance, time stamps, etc.
- Commands connect to the database and can get and alter data from the database

## Commands
- prefix: g (command)
- Start: User needs to type this command to begin using the bot and are granted starting resources
- Balance: Bot gets user data from DB and sends a message to the discord channel displaying user currency
- Daily: Grants user resources every 24 hours
- Pull: Allows users to spend currency to pull a random character card. The cards are based on probabilities depending on rarity
- Fighter: Chooses a current fighter to use for battles
- Favorite: Choose a favorite character card
- List: Displays all characters/characters owned/character rarities
- Team: Display created team
- Set: Create a team of four character cards to use
- Train: Fight enemies of various difficulties to gain experience and currency for character cards
- Profile: Display user information such as milestones, currency, favorites

### Install
- Bot needs to be invited to server
- A connection to a database such as MongoDB needs to be established in botconfig.json
