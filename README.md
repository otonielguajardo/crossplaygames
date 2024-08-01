# Crossplaygames

Filter by platform to easily find crossplay games that are compatible with your preferences.

Made with [Jigsaw](https://jigsaw.tighten.com/), [Bootstrap](https://getbootstrap.com/) and good ol vanilla javascript

![serve](/src/assets/screenshot.png)

## Setup

Run `composer install` and `npm install` to install the application dependencies.

## Update game database

**Warning**
Make sure to set `TWITCH_CLIENT` and `TWITCH_SECRET` env vars before executing the script.

Run `npm run scrap` to update the `games.json` file located at `./data`.

The script scraps the [List of video games that support cross-platform play](https://en.wikipedia.org/wiki/List_of_video_games_that_support_cross-platform_play) wikipedia page and uses the [IGDB API](https://api-docs.igdb.com/) to get each game's cover and details.


## Serve

Run `vendor/bin/jigsaw serve` to start the server and `npm run watch` to compile the assets.

App will be available in `http://localhost:8000/`.

## Build

Run `npm run prod` to build the project.

The build artifacts are located in the `/docs` directory