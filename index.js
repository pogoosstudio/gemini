const discord = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const keep_alive = require("./keep_alive.js");
const MODEL = "gemini-pro";
const API_KEY = process.env.API_KEY ?? "";
const BOT_TOKEN = process.env.BOT_TOKEN ?? "";
const CHANNEL_ID = process.env.CHANNEL_ID ?? "1206255531367473173";


const ai = new GoogleGenerativeAI(API_KEY);
const model = ai.getGenerativeModel({model : MODEL});


const client = new discord.Client({
  intents : Object.keys(discord.GatewayIntentBits),
});

client.on("ready", ()=>{
  console.log("Swagat nahi karoge hamara!");
});

client.login(BOT_TOKEN);
client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;
    if (message.channel.id !== CHANNEL_ID) return;

    const { response } = await model.generateContent(message.cleanContent);
    const generatedText = response.text();

    // Check if the generated text exceeds Discord's limit
    if (generatedText.length > 2000) {
      // Truncate the text to fit within the limit
      const truncatedText = generatedText.substring(0, 1997) + "...";
      await message.reply({
        content: truncatedText,
      });
    } else {
      await message.reply({
        content: generatedText,
      });
    }
  } catch (e) {
    console.log(e);
  }
});




