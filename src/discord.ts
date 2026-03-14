import {
  Client,
  GatewayIntentBits,
  SnowflakeUtil,
  TextChannel,
} from "discord.js";
import dotenv from "dotenv";

dotenv.config();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
await client.login(process.env.DISCORD_APP_TOKEN);

export const getClient = () => client;

export const getPostsFromDate = async (date: Date) => {
  const client = getClient();
  const channel = (await client.channels.fetch(
    process.env.DISCORD_CHANNEL_ID || "",
    { cache: true },
  )) as TextChannel;

  // We're fetching messages at a certain date by constructing a fake message ID
  // at a specified date, then querying messages after that.
  const snowflakeId = SnowflakeUtil.generate({ timestamp: +date });
  return (
    await channel.messages.fetch({
      after: `${snowflakeId}`,
      cache: true,
      limit: 10,
    })
  )
    .filter(
      (message) => message.createdAt <= new Date(+date + 24 * 60 * 60 * 1000),
    )
    .map((v) => v)
    .toReversed();
};
