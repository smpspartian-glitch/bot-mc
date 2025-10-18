const mineflayer = require('mineflayer');
const { Vec3 } = require('vec3');

const SERVER_HOST = 'node-2.banglaverse.net';
const SERVER_PORT = 25715;

let bot1, bot2;

// Login helper
function handleLogin(bot, loginCommand) {
  bot.once('spawn', () => {
    bot.chat(loginCommand);
  });
}

// Whisper shutdown
function setupWhisperShutdown(bot) {
  bot.on('whisper', (username, message) => {
    if (message === 'giganiga') {
      console.log(`[${bot.username}] Received shutdown command from ${username}`);
      if (bot1) bot1.quit('Shutdown triggered by whisper');
      if (bot2) bot2.quit('Shutdown triggered by whisper');
    }
  });
}

// XP level whisper feature
function setupWhisperXPLevel(bot) {
  bot.on('whisper', (username, message) => {
    if (username === bot.username) return;
    if (message.trim().toLowerCase() === 'xp') {
      bot.whisper(username, `My XP level is: ${bot.experience.level}`);
    }
  });
}
// BS bot termination command
function setupbsbot(bot) {
  bot.on('whisper', (username, message) => {
    if (username === bot.username) return;
    if (message.trim().toLowerCase() === 'bsbottermianate') {
      bot.whisper(BS_Bot1, `bot`);
    }
  });
}

// Click nearest button
function clickNearestButton(bot, callback) {
  const block = bot.findBlock({
    matching: b => b.name.includes('button'),
    maxDistance: 6
  });

  if (block) {
    console.log(`[${bot.username}] Found a button. Pressing it...`);
    bot.lookAt(block.position.offset(0.5, 0.5, 0.5), true);
    bot.activateBlock(block);

    setTimeout(() => {
      callback();
    }, 700);
  } else {
    console.log(`[${bot.username}] No button found nearby.`);
    setTimeout(callback, 700);
  }
}

// Attack armor stands loop without crouching
function attackArmorStands(bot) {
  const loop = () => {
    const target = Object.values(bot.entities).find(e => e.name === 'armor_stand');

    if (target) {
      bot.attack(target);
      setTimeout(loop, 1500);
    } else {
      clickNearestButton(bot, () => {
        setTimeout(loop, 1500);
      });
    }
  };

  loop();
}

// Create BS_Editz bot
function createBSEditz() {
  bot1 = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: 'BS_Editz',
  });

  handleLogin(bot1, '/login Jeet@Rexo210705');
  setupWhisperShutdown(bot1);
  setupWhisperXPLevel(bot1);

  bot1.once('spawn', () => {
    attackArmorStands(bot1);
  });

  bot1.on('error', err => console.log('[BS_Editz ERROR]:', err));
  bot1.on('end', () => console.log('[BS_Editz] Disconnected.'));
}

// Create Itx_Mozzy bot (just crouching all the time if you want)
function createItxMozzy() {
  bot2 = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: 'Itx_Mozzy',
  });

  handleLogin(bot2, '/login Jeet@Sujhee');
  setupWhisperShutdown(bot2);
  setupWhisperXPLevel(bot2);

  bot2.once('spawn', () => {
    // Uncomment if you want the bot to sneak constantly
    // bot2.setControlState('sneak', true);
  });

  bot2.on('error', err => console.log('[Itx_Mozzy ERROR]:', err));
  bot2.on('end', () => console.log('[Itx_Mozzy] Disconnected.'));
}

// Start bots
createBSEditz();
createItxMozzy();
