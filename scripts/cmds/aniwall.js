const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "aniwall",
    version: "1.0.0",
    author: "kshitiz",
    role: 0,
    countDown: 10,
    shortDescription: {
      en: "Search for anime wallpapers"
    },
    category: "image",
    guide: {
      en: "{prefix}aniwall <subcommand> -<number of images>"
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    try {
      if (args.length === 0) {
      
        return api.sendMessage(this.config.guide.en, event.threadID, event.messageID);
      }

      let apiUrl = "";
      let numberSearch = 1;

      const subCommand = args.shift();

      switch (subCommand) {
        case "random":
          apiUrl = "https://aniwall-kshtiz.vercel.app/random";
          break;
        case "wedding":
          apiUrl = "https://aniwall-kshtiz.vercel.app/wedding";
          break;
        case "valentine":
          apiUrl = "https://aniwall-kshtiz.vercel.app/valentine";
          break;
        default:
          return api.sendMessage(`Invalid subcommand.`, event.threadID, event.messageID);
      }

      if (args.length > 0) {
        const arg = args[0];
        if (arg.startsWith("-")) {
          numberSearch = parseInt(arg.substring(1)) || 1;
        } else {
          return api.sendMessage(`Invalid argument format.`, event.threadID, event.messageID);
        }
      }

      const res = await axios.get(apiUrl);
      const data = res.data;

      if (!data || !data.urls || data.urls.length === 0) {
        return api.sendMessage(`No wallpapers found.`, event.threadID, event.messageID);
      }

      const imgData = [];

      for (let i = 0; i < Math.min(numberSearch, data.urls.length); i++) {
        const imageUrl = data.urls[i];

        try {
          const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
          await fs.outputFile(imgPath, imgResponse.data);
          imgData.push(fs.createReadStream(imgPath));
        } catch (error) {
          console.error(error);
        }
      }

      await api.sendMessage({
        attachment: imgData,
        body: data.animeName || "- Wallpaper for you -"
      }, event.threadID, event.messageID);

      await fs.remove(path.join(__dirname, 'cache'));
    } catch (error) {
      console.error(error);
      return api.sendMessage(`An error occurred. Please try again later.`, event.threadID, event.messageID);
    }
  }
};
