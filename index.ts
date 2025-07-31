
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

    const aliExpressUrlRegex = new RegExp('https:\/\/ja\.aliexpress\.com\/item\/\d+\.html|https:\/\/a\.aliexpress\.com\/_\w+', 'g');
  const matches = message.content.match(aliExpressUrlRegex);

  if (matches) {
    const urlsToProcess = matches.slice(0, 5);
    for (const url of urlsToProcess) {
      console.log('Processing URL:', url);
      try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        console.log('HTML loaded successfully for:', url);

        const title = $('meta[property="og:title"]').attr('content');
        console.log('Title found:', title);

        const imageUrl = $('meta[property="og:image"]').attr('content');
        console.log('Image URL found:', imageUrl);

        if (title && imageUrl) {
          message.channel.send({
            content: `**${title}**`,
            files: [imageUrl],
          });
        }
      } catch (error) {
        console.error(`Error fetching OGP for ${url}:`, error);
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
