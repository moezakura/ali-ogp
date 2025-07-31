
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

// AliExpressのURLパターンを定義
const aliExpressPatterns = [
  /https:\/\/ja\.aliexpress\.com\/item\/\d+\.html/g,  // 日本語商品ページ
  /https:\/\/a\.aliexpress\.com\/_\w+/g,              // 短縮URL
  /https:\/\/ja\.aliexpress\.com\/i\/\d+\.html/g      // i/形式のURL
];

client.on('messageCreate', async (message) => {
  if (message.author.bot) {
    console.log('Bot message detected, skipping...');
    return;
  }
  console.log('User message detected, processing...', message.content);

  // すべてのパターンをチェックしてマッチするURLを取得
  let matches: string[] = [];
  for (const pattern of aliExpressPatterns) {
    const patternMatches = message.content.match(pattern);
    if (patternMatches) {
      matches = matches.concat(patternMatches);
    }
  }

  if (matches.length > 0) {
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
