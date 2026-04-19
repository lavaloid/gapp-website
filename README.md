# GAPP Archive Website

yeah its exactly as the name suggests

## Setup

Copy `.env.template` into `.env` and fill in info as relevant
- `DISCORD_APP_TOKEN`: Token of the Discord bot
- `DISCORD_CHANNEL_ID`: ID of the channel where the posts are posted
- `DISCORD_ROLE_TAG`: ID of the role being tagged in every new post

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
