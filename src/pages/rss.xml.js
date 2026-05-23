import rss from "@astrojs/rss";
import { SnowflakeUtil } from "discord.js";
import {
  GAPP_PUBLISH_DELAY_DAYS,
  RSS_POST_COUNT,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "../consts";
import { getChannel, trimRolePrefix } from "../discord";
import {
  formatISODate,
  formatReadableDate,
  range,
  startOfDate,
} from "../utils";

export async function GET(context) {
  const today = new Date();

  // we get all messages at once so we dont do like
  // 32 api requests or something
  const dateLimit = startOfDate(
    new Date(+today - (GAPP_PUBLISH_DELAY_DAYS - 1) * 24 * 60 * 60 * 1000),
  );
  const channel = await getChannel();
  const snowflakeId = SnowflakeUtil.generate({ timestamp: +dateLimit });
  const messages = (
    await channel.messages.fetch({
      before: `${snowflakeId}`,
      cache: true,
      limit: RSS_POST_COUNT + 10,
    })
  )
    .map((v) => v)
    .toReversed();

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    stylesheet: "/styles.xsl",
    items: await Promise.all(
      range(0, RSS_POST_COUNT - 1)
        .map(async (i) => {
          const date = startOfDate(
            new Date(
              +today -
                (GAPP_PUBLISH_DELAY_DAYS + (RSS_POST_COUNT - i - 1)) *
                  24 *
                  60 *
                  60 *
                  1000,
            ),
          );

          const message = messages.find((message) => message.createdAt >= date);
          return {
            title: formatReadableDate(date),
            link: `/archive/${formatISODate(date)}`,
            pubDate: startOfDate(
              new Date(+today - (RSS_POST_COUNT - i - 1) * 24 * 60 * 60 * 1000),
            ).toISOString(),
            description: trimRolePrefix(message?.content.trim() ?? "").split(
              "\n",
            )[0],
          };
        })
        .toReversed(),
    ),
  });
}
