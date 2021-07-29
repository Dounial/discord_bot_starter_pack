// Activating dependencies and setting constants
require("dotenv").config();
const { Client, WebhookClient } = require('discord.js');
const Discord = require('discord.js');
const bot = new Discord.Client();

/*
·▄▄▄▄  ▪  .▄▄ ·  ▄▄·       ▄▄▄  ·▄▄▄▄      ▄▄▄▄·       ▄▄▄▄▄  
██▪ ██ ██ ▐█ ▀. ▐█ ▌▪▪     ▀▄ █·██▪ ██     ▐█ ▀█▪▪     •██    
▐█· ▐█▌▐█·▄▀▀▀█▄██ ▄▄ ▄█▀▄ ▐▀▀▄ ▐█· ▐█▌    ▐█▀▀█▄ ▄█▀▄  ▐█.▪  
██. ██ ▐█▌▐█▄▪▐█▐███▌▐█▌.▐▌▐█•█▌██. ██     ██▄▪▐█▐█▌.▐▌ ▐█▌·  
▀▀▀▀▀• ▀▀▀ ▀▀▀▀ ·▀▀▀  ▀█▄▀▪.▀  ▀▀▀▀▀▀•     ·▀▀▀▀  ▀█▄▀▪ ▀▀▀   
.▄▄ · ▄▄▄▄▄ ▄▄▄· ▄▄▄  ▄▄▄▄▄▄▄▄ .▄▄▄       ▄▄▄· ▄▄▄·  ▄▄· ▄ •▄ 
▐█ ▀. •██  ▐█ ▀█ ▀▄ █·•██  ▀▄.▀·▀▄ █·    ▐█ ▄█▐█ ▀█ ▐█ ▌▪█▌▄▌▪
▄▀▀▀█▄ ▐█.▪▄█▀▀█ ▐▀▀▄  ▐█.▪▐▀▀▪▄▐▀▀▄      ██▀·▄█▀▀█ ██ ▄▄▐▀▀▄·
▐█▄▪▐█ ▐█▌·▐█ ▪▐▌▐█•█▌ ▐█▌·▐█▄▄▌▐█•█▌    ▐█▪·•▐█ ▪▐▌▐███▌▐█.█▌
 ▀▀▀▀  ▀▀▀  ▀  ▀ .▀  ▀ ▀▀▀  ▀▀▀ .▀  ▀    .▀    ▀  ▀ ·▀▀▀ ·▀  ▀
*/

// A BOT FOR MODERATION


// Starting Client
const client = new Client({
  partials: ['MESSAGE', 'REACTION']
});


// Starting Webhook and making sure we get our webhook-ID
// as well as webhook-token by the before changed
// .env-file
const webhookClient = new WebhookClient(
  process.env.WEBHOOK_ID,
  process.env.WEBHOOK_TOKEN,
);

// Setting constant prefix as dollar sign
const PREFIX = "$";

// Log-in message to see in console if bot actually works
client.on('ready', () => {
  console.log(`${client.user.tag}-bot with .js-data works!`);
});


// Explaining bot that if message starts with $ it is a command
client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
// When writing $kick it kicks members
    if (CMD_NAME === 'kick') {
      if (!message.member.hasPermission('KICK_MEMBERS'))
        // if the user doesn't have the needed permissions
        // to activate that command it tells the user that
        return message.reply('You do not have permissions to use that command');
				// If argument does not contain any text it tells the user to
				// provide an ID
      if (args.length === 0)
        return message.reply('Please provide an ID');
			// Looks for server if someone wrote a command
      const member = message.guild.members.cache.get(args[0]);
			// When someone kicks someone the bot replies with 'member was kicked'
			// however when the person can't get kicked it tells you that it cannot
			// kick that person
      if (member) {
        member
          .kick()
          .then((member) => message.channel.send(`${member} was kicked.`))
          .catch((err) => message.channel.send('I cannot kick that user *sad noise* D: :('));
			// if it can not find that person the bot tells you that the member was not found
      } else {
        message.channel.send('That member was not found');
      }
// When writing $ban it bans members //
    } else if (CMD_NAME === 'ban') {
      if (!message.member.hasPermission('BAN_MEMBERS'))
				// if the person who executed the command does not have permissions to
				// use the command the bot says that
        return message.reply("You do not have permissions to use that command");
			// If argument does not contain any text it tells the user to provide an ID
      if (args.length === 0) return message.reply("Please provide an ID");
			// else if ID is right it prints/outputs that the user has been banned
			try {
        const user = await message.guild.members.ban(args[0]);
        message.channel.send('User was banned successfully');
			// If it catches an error it starts a console log to tell you what's wrong and
			// sends a message to the Discord-server that an error occured
      } catch (err) {
        console.log(err);
        message.channel.send('An error occured. Either I do not have permissions or the user was not found');
      }
// When writing $announce it announces all members with the text written after $announce via webhook //
    } else if (CMD_NAME === 'announce') {
      console.log(args);
      const msg = args.join(' ');
      console.log(msg);
      webhookClient.send(msg);
    }
  }
});



 // A BOT FOR PLAYING TEXT PING PONG - WHENEVER YOU SAY "PING", IT REPLIES "PONG"


// Create an event listener for messages
client.on('message', message => {
  // If the message is "ping"
  if (message.content === 'ping') {
    // Send "pong" to the same channel
    message.channel.send('pong');
  }
});



// A BOT THAT CHANGES ITS STATUS (THE DISCORD RICH PRESENCE) FROM ITSELF


// Log-in
client.login(process.env.DISCORDJS_BOT_TOKEN);
// If the bot is ready and working it will say '(name of bot)-bot with
// changing bot-status works!
client.on('ready', () => {
  console.log(`${client.user.tag}-bot with changing bot-status works!`);

// Sets the const for arrayOfStatus and displays each 1. In how many servers
// the bot is in, how many channels there are for the bot, how many users
// are in the bots server(s), the name of the Discord Bot and last but not
// least it displays 'Online and working!'
const arrayOfStatus = [
	`${client.guides.cache.size} servers`,
	`${client.channels.cache.size} channels`,
	`${client.users.cache.size} users`,
	`${client.user.tag} discord bot!`
	`Online and working!`,
];

// Define (let) index to zero
let index = 0
// Sets the interval (to 5000) like seen at the end of the paragraph
setInterval(() => {
	// If index is equal to array of status length then index equals zero
	if(index === arrayOfStatus.length) index = 0;
	// Constant status equals to array of status index
	const status = arrayOfStatus[index];
	// Shows the status in console log
	console.log(status);
	// Open client so user can set the Status Activity
	client.user.setActivity(status);
	// Use index++ to implement it
	index++;
// Make sure to change the number below to whatever time you want that the bot
// changes its status to (number is in miliseconds/ms, 5000ms = 5 seconds)
}, 5000)

// This makes sure the client/Discord-bot is logged in and is taking and 
// processing its data from the before edited .env-file
client.login(process.env.DISCORDJS_BOT_TOKEN)
