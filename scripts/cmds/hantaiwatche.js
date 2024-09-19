const axios = require("axios");

async function a(name) {
  try {
    const res = await axios.get(`https://kshitiz-donn.vercel.app/search/${encodeURIComponent(name)}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch hentai episodes");
  }
}

async function b(episode) {
  try {
    const res = await axios.get(`https://kshitiz-donn.vercel.app/video/${encodeURIComponent(episode)}`);
    return res.data.videoUrl;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch episode video URL");
  }
}

async function c(url) {
  try {
    const res = await axios.get(`https://shortner-sepia.vercel.app/kshitiz?url=${encodeURIComponent(url)}`);
    return res.data.shortened;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to shorten URL");
  }
}

module.exports = {
  config: {
    name: "hentaiwatch",
    author: "Vex_Kshitiz",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "Watch hentai",
    longDescription: "Get hentai episode video URL",
    category: "Anime",
    guide: "{p}hentaiwatch <hentai_name>",
  },

  onStart: async function ({ api, event, args }) {
    const name = args.join(" ");

    if (!name) {
      api.sendMessage({ body: "Please provide the name of the hentai." }, event.threadID, event.messageID);
      return;
    }

    try {
      const eps = await a(name);

      if (!eps || eps.length === 0) {
        api.sendMessage({ body: `No episodes found for the hentai: ${name}` }, event.threadID, event.messageID);
        return;
      }

      const epList = eps.map((ep, i) => `${i + 1}. ${ep}`).join("\n");
      const msg = `Reply to this message with the episode number you want to watch:\n\n${epList}`;

      api.sendMessage({ body: msg }, event.threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "hentaiwatch",
          messageID: info.messageID,
          eps,
        });
      });
    } catch (err) {
      console.error(err);
      api.sendMessage({ body: "Sorry, an error occurred while processing your request." }, event.threadID);
    }
  },

  onReply: async function ({ api, event, Reply, args }) {
    const { eps } = Reply;
    const epIndex = parseInt(args[0], 10);

    if (isNaN(epIndex) || epIndex <= 0 || epIndex > eps.length) {
      api.sendMessage({ body: "Invalid input.\nPlease provide a valid episode number." }, event.threadID, event.messageID);
      return;
    }

    const epName = eps[epIndex - 1];

    try {
      const videoUrl = await b(epName);
      const shortUrl = await c(videoUrl);

      const msg = `"${epName}":\n\n${shortUrl}`;

      api.sendMessage({ body: msg }, event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
      api.sendMessage({ body: "An error occurred while processing the episode.\nPlease try again later." }, event.threadID);
    } finally {
      global.GoatBot.onReply.delete(event.messageID);
    }
  },
};
