const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 義 Taki | 🌊 勇 ]";
 
module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "NTKhang", // orginal author Kshitiz
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "View command usage",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },
 
  onStart: async function ({ message, args, event, threadsData, role }) {
  const { threadID } = event;
  const threadData = await threadsData.get(threadID);
  const prefix = getPrefix(threadID);
 
  if (args.length === 0) {
      const categories = {};
      let msg = "";
 
      msg += `╔══════════════╗\n      𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦\n╚══════════════╝`;
 
      for (const [name, value] of commands) {
          if (value.config.role > 1 && role < value.config.role) continue;
 
          const category = value.config.category || "Uncategorized";
          categories[category] = categories[category] || { commands: [] };
          categories[category].commands.push(name);
      }
8
      Object.keys(categories).forEach(category => {
          if (category !== "info") {
              msg += `\n╭────────────⭓\n│『 ${category.toUpperCase()} 』`;
 
              const names = categories[category].commands.sort();
              for (let i = 0; i < names.length; i += 1) {
                  const cmds = names.slice(i, i + 1).map(item => `│★${item}`);
                  msg += `\n${cmds.join(" ".repeat(Math.max(0, 5 - cmds.join("").length)))}`;
              }
 
              msg += `\n╰────────⭓`;
          }
      });
 
      const totalCommands = commands.size;
      msg += `\n𝘾𝙪𝙧𝙧𝙚𝙣𝙩𝙡𝙮, 𝙏𝙝𝙞𝙨 𝙗𝙤𝙩 𝙝𝙖𝙫𝙚  ${totalCommands} 𝙘𝙤𝙢𝙢𝙖𝙣𝙙𝙨 𝙩𝙝𝙖𝙩 𝙘𝙖𝙣 𝙗𝙚 𝙪𝙨𝙚𝙙. 𝙎𝙤𝙤𝙣 𝙢𝙤𝙧𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙𝙨 𝙬𝙞𝙡𝙡 𝙗𝙚 𝙖𝙙𝙙𝙚𝙙\n`;
      msg += `𝙏𝙮𝙥𝙚 ${prefix} 𝙝𝙚𝙡𝙥 𝗰𝙤𝙢𝙢𝙖𝙣𝙙 𝗡𝗮𝗺𝗲 𝘁𝗼 𝘃𝗶𝗲𝘄 𝘁𝗵𝗲 𝗱𝗲𝘁𝗮𝗶𝗹𝘀 𝗼𝗳 𝘁𝗵𝗮𝘁 𝗰𝗼𝗺𝗺𝗮𝗻𝗱\n`;
      msg += `𝙁𝙊𝙍 𝘼𝙉𝙔 𝙊𝙏𝙃𝙀𝙍 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 𝘾𝙊𝙉𝙏𝙍𝘼𝘾𝙏 𝙊𝙒𝙉𝙀𝙍 𝘽𝙔 𝙏𝙔𝙋𝙄𝙉𝙂 /𝘾𝘼𝙇𝙇𝘼𝘿 𝙃𝙀𝙇𝙋`;
 
 
      const helpListImages = [
 
"https://i.imgur.com/O5JOURb.png",
"https://i.imgur.com/O5JOURb.png', ",
"https://i.imgur.com/O5JOURb.png",
"https://i.imgur.com/O5JOURb.png",
"https://i.imgur.com/RrRNARq.gif",
"https://i.imgur.com/jBd6fgF.gif",
"https://i.imgur.com/uB4nTr7.gif"
];
 
 
      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];
 
 
      await message.reply({
          body: msg,
          attachment: await global.utils.getStreamFromURL(helpListImage)
      });
  } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));
 
      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";
 
        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";
 
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);
 
        const response = `╭── NAME ────⭓
  │ ${configCommand.name}
  ├── INFO
  │ Description: ${longDescription}
  │ Other names: ${configCommand.aliases ? configCommand.aliases.join(", ") : "Do not have"}
  │ Other names in your group: Do not have
  │ Version: ${configCommand.version || "1.0"}
  │ Role: ${roleText}
  │ Time per command: ${configCommand.countDown || 1}s
  │ Author: ${author}
  ├── Usage
  │ ${usage}
  ├── Notes
  │ The content inside <XXXXX> can be changed
  │ The content inside [a|b|c] is a or b or c
  ╰━━━━━━━❖`;
 
        await message.reply(response);
      }
    }
  },
};
 
function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
							    }
