# import everything necessary
import discord
import random
import asyncio
from discord.ext import commands, tasks
from googlesearch import search
from discord.ext import commands
from itertools import cycle

"""
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
"""

# PART 1 / USING BOT FOR GOOGLE-SEARCH


# asking bot for searching
client = commands.Bot(command_prefix = 'search')

# makes bot print/output "Bot with .py-data works!" when bot is online
@client.event
async def on_ready():
        print("Bot with .py-data works!")

# Adds asynchronous client/bot event on message
@client.event
async def on_message(message):
        # if the message starts with 'just google'
        # the bot is going to search google for
        # the text written after 'just google'
    if message.content.startswith('just google'):
        searchContent = ""
        text = str(message.content).split(' ')
            # here the bot searches in the google-index for the content
            for i in range(2, len(text)):
            searchContent = searchContent + text[i]
            # here the bot writes the found content in the text channel in Discord
            for j in search(searchContent, tld="co.in", num=1, stop=1, pause=2):
            await message.channel.send(j)


# PART 2 / GUESSING GAME

    # login and prints/outputs who is logged in as well as the users ID
class MyClient(discord.Client):
    async def on_ready(self):
        print('Logged in as')
        print(self.user.name)
        print(self.user.id)
        print('------')

    async def on_message(self, message):
        # we do not want the bot to reply to itself so I gave him a if-loop for
        # it to listen to authors messages only
        if message.author.id == self.user.id:
            return

        # if the message starts with $guess 
        # then it says 'Guess a number between 1 and 10'
        if message.content.startswith('$guess'):
            await message.channel.send('Guess a number between 1 and 10.')
            # defines when m is correct it returns authors message and looks if
            # written content is a digit
            def is_correct(m):
                return m.author == message.author and m.content.isdigit()
            # gets a random number between 1 and 10
            answer = random.randint(1, 10)
            # waits for message from user with 5 seconds timeout, if the timer runs
            # out it automatically sends 'sorry, you took too long'-text
            try:
                guess = await self.wait_for('message', check=is_correct, timeout=5.0)
            except asyncio.TimeoutError:
                return await message.channel.send('Sorry, you took too long - The correct number was {}.'.format(answer))

            # if answer is correct it says 'Correct!'
            if int(guess.content) == answer:
                await message.channel.send('Correct!')
            # else if wrong input it says 'It actually is (x)'
            else:
                await message.channel.send('It actually is {}.'.format(answer))

# login
client = MyClient()
client.run('token')

# PART 3 / USING DISCORD LOOP AS STATUS

# sets . as command prefix (for example .status or .1)
client = commands.Bot(command_prefix= '.')
status = (['0', '1'])

# If it works it prints 'Script with loop works'
@client.event
async def on_ready():
    print('Script with loop works')

# Task (Changing status) makes a change every 10 seconds
@tasks.loop(seconds=10)
async def change_status():
    await client.change_presence(activity=discord.Game(next(status)))

# This keeps the client/bot running so it doesn't go offline by itself
client.run('BOT TOKEN HERE')
