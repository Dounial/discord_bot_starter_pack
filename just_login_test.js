// this is just the file to only test the log-in //

// this basically starts dotenv and discord.js //
require("dotenv").config();
const Discord = require('discord.js');

// This starts the Discord client //
const client = new Discord.Client();

// This shows if the client is actually running //
client.once('ready', () => {;
    console.log('Bot is online!');
});