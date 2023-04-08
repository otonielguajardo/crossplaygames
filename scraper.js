require('dotenv').config();
const fs = require('fs');
const {promises: fsPromises} = fs;
const cheerio = require('cheerio');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
const wait = 100;

const loadLocalData = async () => {
	const data = await fsPromises.readFile('./src/server/data/games.json', 'utf8');
	return JSON.parse(data);
}

const saveLocalData = async (json) => {
	await fsPromises.writeFile('./src/server/data/games.json', JSON.stringify(json));
};

const scrapWikipedia = async () => {
	let games = [];

	const wikipedia = await fetch('https://en.wikipedia.org/wiki/List_of_video_games_that_support_cross-platform_play');
	const html = await wikipedia.text();
	const $ = cheerio.load(html);

	let title = '';
	$('table#softwarelist:first() tbody tr').each((rowIx, row) => {
		if (rowIx <= 2) return;

		let platforms = '';
		$(row).find('td').each((columnIx, column) => {
			if (columnIx == 0) {
				title = $(column).text().trim() != '' ? $(column).text().trim() : title;
			}
			if (columnIx >= 1 && columnIx <= 14) {
				platforms += $(column).text().trim() + ',';
			};
		});
		platforms = platforms.replace(/\s/g, '');
		platforms = platforms.split(',').filter((el) => { return el; });

		games.push({
			title,
			platforms
		});
	});
	
	return games;
};

const dewit = async () => {
	const data = await loadLocalData();

	const today = dayjs();
	// const nextFetch = dayjs(data.lastFetch).add(1, 'days');
	// const willFetch = today.isAfter(nextFetch);

	// console.log({ nextFetch: nextFetch.format(), ____today: today.format(), willFetch });

	// if (!willFetch) return data.games;

	const games = await scrapWikipedia();

	const url = `https://id.twitch.tv/oauth2/token?client_id=${process.env['TWITCH_CLIENT']}&client_secret=${process.env['TWITCH_SECRET']}&grant_type=client_credentials`;
	const auth = await fetch(url, { method: 'POST' });
	const { access_token } = await auth.json();

	process.stdout.write(`\n`);
	const progressBarLength = 10;
	await asyncForEach(games, async (game, index) => {
		await sleep(wait);
		const url = await fetchCoverUrlFromIGDB(access_token, game.title);
		games[index].cover = url;

		const elapsedTime = dayjs().diff(today);
		const averageTimePerIteration = elapsedTime / (index + 1);
		const remainingTime = averageTimePerIteration * (games.length - (index + 1));
		const remainingTimeFormatted = dayjs().add(remainingTime, 'ms').fromNow();
		
  	const progress = (index / games.length) * 100;
  	const bar = '⣀'.repeat(Math.round(progress / progressBarLength)) + ' '.repeat(progressBarLength - Math.round(progress / progressBarLength));

		process.stdout.clearLine();
  	process.stdout.cursorTo(0);
  	process.stdout.write(`[${bar}] ${Math.round(progress)}% | finishes ${remainingTimeFormatted} | ${index + 1}/${games.length} | ${game.title}`);
	});
	process.stdout.write(`\n`);

	await saveLocalData({ lastFetch: today.format(), games });

	return games;
};

const fetchCoverUrlFromIGDB = async (access_token, title) => {
	const response = await fetch(`https://api.igdb.com/v4/games`, {
		method: 'POST',
		headers: {
			'Client-ID': process.env['TWITCH_CLIENT'],
			'Authorization': `Bearer ${access_token}`,
		},
		body: `search "${title}"; fields name, cover.url; limit 1;`
	});

	const data = await response.json();
	const url = data[0]?.cover?.url;
	return url != undefined ? `https://${url.substring(2).replace('t_thumb', 't_cover_big')}` : null;
};

const asyncForEach = async function (array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

dewit();