import { Telegraf } from 'telegraf';
import cron from 'node-cron';
import fs from 'fs';
import { DateTime } from 'luxon';

const bot = new Telegraf('7559625255:AAHnTfy8SPnO5sj9Z2U5Ohil-CFFIYBJoDw');
const GROUP_ID = -1001234567890;
const COUNTER_FILE = './counter.json';
const INITIAL_COUNT = 56;

let currentCount = INITIAL_COUNT;

if (fs.existsSync(COUNTER_FILE)) {
  const data = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf-8'));
  currentCount = data.count;
} else {
  fs.writeFileSync(COUNTER_FILE, JSON.stringify({ count: INITIAL_COUNT }));
}

cron.schedule(
  '0 6 * * *',
  () => {
    bot.telegram.sendMessage(GROUP_ID, `🏋️ Today you must do ${currentCount} push-ups!`);
    currentCount++;
    fs.writeFileSync(COUNTER_FILE, JSON.stringify({ count: currentCount }));
  },
  {
    timezone: 'Asia/Tehran',
  }
);

bot.hears(/pushup/i, (ctx) => {
  ctx.reply('Yeahhh Bodyyyyyyyyyyyyyyyy 💪🏻');
});

bot.hears(/how long\?/i, (ctx) => {
  const now = DateTime.now().setZone('Asia/Tehran');
  let target = now.set({ hour: 6, minute: 0, second: 0, millisecond: 0 });
  if (now >= target) {
    target = target.plus({ days: 1 });
  }
  const diff = target.diff(now, ['hours', 'minutes']);
  const hours = Math.floor(diff.hours);
  const minutes = Math.floor(diff.minutes);
  ctx.reply(`⏳ ${hours}h ${minutes}m left until the next push-up!\n💪 Today you must do ${currentCount} push-ups.`);
});

bot.hears(/help/i, (ctx) => {
  ctx.reply(`📋 Available Commands:
• pushup → Motivation message
• how long? → Time left until the next push-up message
• help → Show this help menu`);
});

bot.launch();
console.log('🤖 Bot is running...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
