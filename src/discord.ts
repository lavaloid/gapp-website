import {
  Client,
  GatewayIntentBits,
  SnowflakeUtil,
  TextChannel,
} from "discord.js";
import dotenv from "dotenv";
import { GAPP_CHANNEL_START_DATE, GAPP_START_DATE } from "./consts";

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
export const getChannel = async () => {
  const client = getClient();
  return (await client.channels.fetch(process.env.DISCORD_CHANNEL_ID || "", {
    cache: true,
  })) as TextChannel;
};

export const getPreChannelMessages = async (channel: TextChannel) => {
  const snowflakeId = SnowflakeUtil.generate({ timestamp: +GAPP_START_DATE });
  return (
    await channel.messages.fetch({
      after: `${snowflakeId}`,
      cache: true,
      limit:
        Math.round(
          (+GAPP_CHANNEL_START_DATE - +GAPP_START_DATE) / (24 * 60 * 60 * 1000),
        ) *
          2 +
        8,
    })
  )
    .map((v) => v)
    .toReversed();
};

export const getPostsFromDate = async (date: Date) => {
  /**
   * GAPP posts before GAPP_CHANNEL_START_DATE (2021 Nov 21) are posted in
   * #other-testing-submissions, and they're only moved to #daily-pencil-puzzles
   * on GAPP_CHANNEL_START_DATE. So we should handle those posts differently
   */

  const channel = await getChannel();

  if (date < GAPP_CHANNEL_START_DATE) {
    /**
     * Messages before GAPP_CHANNEL_START_DATE follow this pattern:
     * - 8 informational messages & reserved pins messages from bakpao
     * - After that every two posts are daily puzzles with this pattern:
     *    - bakpao: <date>, puzzle by <author>
     *    - CopynPaste: <the actual puzzle content>
     */
    const rawMessages = await getPreChannelMessages(channel);

    const dateIndex = Math.round(
      (+date - +GAPP_START_DATE) / (24 * 60 * 60 * 1000),
    );

    const metaMessage = rawMessages.at(dateIndex * 2 + 8);
    const puzzleMessage = rawMessages.at(dateIndex * 2 + 9);

    const authorName = metaMessage?.content.split(" by ").at(1);

    if (!puzzleMessage) return [];
    return [
      {
        ...puzzleMessage,
        member: null,
        authorOverride: authorName,
      },
    ];
  } else {
    // We're fetching messages at a certain date by constructing a fake message ID
    // at a specified date, then querying messages after that.
    const snowflakeId = SnowflakeUtil.generate({ timestamp: +date });
    return Promise.all(
      (
        await channel.messages.fetch({
          after: `${snowflakeId}`,
          cache: true,
          limit: 10,
        })
      )
        .filter(
          (message) =>
            message.createdAt <= new Date(+date + 24 * 60 * 60 * 1000),
        )
        .map(async (v) => {
          // because of discord weirdness the `member` field might still be null
          // even if the user is in the server, so we try to fetch their name manually
          let member = null;
          if (v.member) {
            member = v.member;
          } else {
            try {
              member = await channel.guild.members.fetch({
                user: v.author.id,
                cache: true,
              });
            } catch (err) {
              // user isn't in server, skip fetching
            }
          }

          return { ...v, member, authorOverride: undefined }; // typescript nonsense
        })
        .toReversed(),
    );
  }
};

export const getDateOfPost = async (messageId: string) => {
  const msgTimestamp =
    SnowflakeUtil.deconstruct(messageId).timestamp.toString();
  const msgDate = new Date(+msgTimestamp);

  // Error parsing, return null
  if (isNaN(+msgDate)) return null;

  if (msgDate >= GAPP_CHANNEL_START_DATE) {
    return msgDate;
  }

  // if before gapp channel, we manually find the index by traversing each
  const channel = await getChannel();
  const rawMessages = await getPreChannelMessages(channel);

  const index = rawMessages.findIndex((message) => message.id === messageId);
  if (index === -1) {
    return null;
  }
  
  const daysSinceStartDate = Math.ceil((index - 9) / 2);
  console.log(daysSinceStartDate);
  return new Date(
    +GAPP_START_DATE + 24 * 60 * 60 * 1000 * daysSinceStartDate,
  );
};
