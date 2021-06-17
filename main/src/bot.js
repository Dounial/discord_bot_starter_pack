// Activating dependencies //
require("dotenv").config();
const { Client, WebhookClient } = require('discord.js');
const Discord = require('discord.js');
const bot = new Discord.Client();

// Starting Client //
const client = new Client({
  partials: ['MESSAGE', 'REACTION']
});


// Starting Webhook //
const webhookClient = new WebhookClient(
  process.env.WEBHOOK_ID,
  process.env.WEBHOOK_TOKEN,
);

// Explaining what Prefix is //
const PREFIX = "$";

// Log-in message //
client.on('ready', () => {
  console.log(`${client.user.tag}-bot with .js-data works!`);
});


// Explaining bot that if msg starts with $ it is a command //
client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
// When writing $kick it kicks members //
    if (CMD_NAME === 'kick') {
      if (!message.member.hasPermission('KICK_MEMBERS'))
        return message.reply('You do not have permissions to use that command');
      if (args.length === 0)
        return message.reply('Please provide an ID');
      const member = message.guild.members.cache.get(args[0]);
      if (member) {
        member
          .kick()
          .then((member) => message.channel.send(`${member} was kicked.`))
          .catch((err) => message.channel.send('I cannot kick that user *sad noise* D: :('));
      } else {
        message.channel.send('That member was not found');
      }
// When writing $ban it bans members //
    } else if (CMD_NAME === 'ban') {
      if (!message.member.hasPermission('BAN_MEMBERS'))
        return message.reply("You do not have permissions to use that command");
      if (args.length === 0) return message.reply("Please provide an ID");
      try {
        const user = await message.guild.members.ban(args[0]);
        message.channel.send('User was banned successfully');
      } catch (err) {
        console.log(err);
        message.channel.send('An error occured. Either I do not have permissions or the user was not found');
      }
// When writing $announce it announces members via webhook //
    } else if (CMD_NAME === 'announce') {
      console.log(args);
      const msg = args.join(' ');
      console.log(msg);
      webhookClient.send(msg);
    }
  }
});


/**
 * A ping pong bot, whenever you send "ping", it replies "pong".
 */

// Create an event listener for messages
client.on('message', message => {
  // If the message is "ping"
  if (message.content === 'ping') {
    // Send "pong" to the same channel
    message.channel.send('pong');
  }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);



bot.on('ready', () => {

    const arrayOfStatus = [
        `ONLINE`,
        '0NLINE',
        'ONLINE'

    ];
    let index = 0;
    setInterval(() => {
        if(index === arrayOfStatus.length) index = 0;
        const status = arrayOfStatus[index];
        console.log(status)
        bot.user.setActivity(status, { type: "Please select a status" }).catch(console.error)// PLAYING, WATCHING, LISTENING, STREAMING,
    }, 5000) //in ms
});

client.login(process.env.DISCORDJS_BOT_TOKEN)