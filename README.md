# [CrossplayGames.xyz](https://crossplaygames.xyz)

Filter by platform to easily find crossplay games that are compatible with your preferences.

Made with [Analog](https://analogjs.org), the Angular meta-framework.

![serve](/src/assets/screenshot.png)

## Setup

Run `npm i` to install the application dependencies.

## Development

Run `npm run dev` to start the dev server.

Navigate to `http://localhost:3000/`. The application will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the client/server project.

The client build artifacts are located in the `dist/client` directory.

The server for the API build artifacts are located in the `dist/analog` directory.

## Serve

Run `npm run start` to serve the build of the app.

## Test

Run `npm run test` to run unit tests with [Vitest](https://vitest.dev).

## Update game database

**Warning**
Make sure to set `TWITCH_CLIENT` and `TWITCH_SECRET` env vars before executing the script.

Run `npm run scrap` to update the `games.json` file located at `./data`.

The script scraps the [List of video games that support cross-platform play](https://en.wikipedia.org/wiki/List_of_video_games_that_support_cross-platform_play) wikipedia page and uses the [IGDB API](https://api-docs.igdb.com/) to get each game's cover and details.
