# import everything necessary
import discord
import random
import asyncio
from discord.ext import commands, tasks
from googlesearch import search
from discord.ext import commands
from itertools import cycle


# PART 1 / USING BOT FOR GOOGLE


# asking bot for searching
client = commands.Bot(command_prefix = 'search')

# triggered when bot is online
@client.event
async def on_ready():
        print("Bot with .py-data works!")

# just google command trigger
@client.event
async def on_message(message):
    if message.content.startswith('just google'):
        searchContent = ""
        text = str(message.content).split(' ')
        for i in range(2, len(text)):
            searchContent = searchContent + text[i]

        for j in search(searchContent, tld="co.in", num=1, stop=1, pause=2):
            await message.channel.send(j)


# PART 2 / GUESSING GAME


class MyClient(discord.Client):
    async def on_ready(self):
        print('Logged in as')
        print(self.user.name)
        print(self.user.id)
        print('------')

    async def on_message(self, message):
        # we do not want the bot to reply to itself
        if message.author.id == self.user.id:
            return

        if message.content.startswith('$guess'):
            await message.channel.send('Guess a number between 1 and 10.')

            def is_correct(m):
                return m.author == message.author and m.content.isdigit()

            answer = random.randint(1, 10)

            try:
                guess = await self.wait_for('message', check=is_correct, timeout=5.0)
            except asyncio.TimeoutError:
                return await message.channel.send('Sorry, you took too long - The correct number was {}.'.format(answer))

            if int(guess.content) == answer:
                await message.channel.send('Correct!')
            else:
                await message.channel.send('It actually is {}.'.format(answer))

client = MyClient()
client.run('token')

# PART 3 / USING DISCORD LOOP AS STATUS

client = commands.Bot(command_prefix= '.')
status = (['0', '1'])

@client.event
async def on_ready():
    print('Script with loop works')

@tasks.loop(seconds=10)
async def change_status():
    await client.change_presence(activity=discord.Game(next(status)))


client.run('BOT TOKEN HERE')
