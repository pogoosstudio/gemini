const discord = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const keep_alive = require("./keep_alive.js");

const MODEL = "gemini-pro";
const API_KEY = "AIzaSyBpkpZqqctNT8WLHJdUKqmm3j7si9F_h8g";
const BOT_TOKEN = process.env.token;
const CHANNEL_ID = "1214052772740206643";

const ai = new GoogleGenerativeAI(API_KEY);
const model = ai.getGenerativeModel({ model: MODEL });

const client = new discord.Client({
  intents: Object.keys(discord.GatewayIntentBits),
});

client.on("ready", () => {
  console.log("Swagat nahi karoge hamara!");
});

client.login(BOT_TOKEN);
client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;
    if (message.channel.id !== CHANNEL_ID) return;

    const replyWithGeneratedText = async (text) => {
      // Check if the generated text exceeds Discord's limit
      if (text.length > 2000) {
        // Truncate the text to fit within the limit
        text = text.substring(0, 1997) + "...";
      }
      await message.reply({
        content: text,
      });
    };

    if (message.attachments.size > 0) {
      const attachment = message.attachments.first();
      if (attachment.contentType.startsWith("image")) {
        const prompt = message.cleanContent;
        const imageURL = attachment.url;
        const response = await runGemini(prompt, "gemini-pro-vision", imageURL);
        await replyWithGeneratedText(response);
      }
    } else {
      const { response } = await model.generateContent(message.cleanContent);
      await replyWithGeneratedText(response.text());
    }
  } catch (e) {
    console.log(e);
  }
});

async function runGemini(prompt, model, imageURL = null) {
  const genAImodel = ai.getGenerativeModel({ model: model });
  if (model === "gemini-pro") {
    const result = await genAImodel.generateContent(prompt);
    return result.response.text();
  } else {
    const response = await fetch(imageURL);
    const fileBuffer = await response.arrayBuffer();
    const part = {
      inlineData: {
        data: Buffer.from(fileBuffer).toString("base64"),
        mimeType: response.headers.get("content-type"),
      },
    };
    const result = await genAImodel.generateContent([prompt, part]);
    return result.response.text();
  }
}
