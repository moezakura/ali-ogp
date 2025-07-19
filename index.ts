
import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';


config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) {
    console.log('Bot message detected, skipping...');
    return;
  }
  console.log('User message detected, processing...', message.content);

  const aliExpressUrlRegex = /https:\/\/ja\.aliexpress\.com\/item\/\d+\.html|https:\/\/a\.aliexpress\.com\/_\w+/;
  const match = message.content.match(aliExpressUrlRegex);

  if (match) {
    const url = match[0];
    console.log('Processing URL:', url);
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      console.log('HTML loaded successfully');

      const title = $('meta[property="og:title"]').attr('content');
      console.log('Title found:', title);

      const imageUrl = $('meta[property="og:image"]').attr('content');
      console.log('Image URL found:', imageUrl);

      if (title && imageUrl) {
        message.reply({
          content: `**${title}**`,
          files: [imageUrl],
        });
      }
    } catch (error) {
      console.error('Error fetching OGP:', error);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
