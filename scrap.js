require('dotenv').config();
const fs = require('fs');
const {promises: fsPromises} = fs;
const cheerio = require('cheerio');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
const wait = 50;

const loadLocalData = async () => {
	const data = await fsPromises.readFile('./data/games.json', 'utf8');
	return JSON.parse(data);
}

const saveLocalData = async (json) => {
	await fsPromises.writeFile('./data/games.json', JSON.stringify(json));
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
			// set title
			if (columnIx === 0) {
				title = $(column).text().trim() != '' ? $(column).text().trim() : title;
			}

			// add platform
			if (columnIx >= 1 && columnIx <= 13) {
				platforms += $(column).text().trim() + ',';
			};
		});

		// discriminate platforms
		platforms = platforms.replace(/Vita|PS3|PS4|PS5|Xbox Cloud Gaming|Wii U|XB360/gi, '');
		// group PC launchers
		platforms = platforms.replace(/Steam|Epic|Origin|MS|GFWL|GOG|Battle.net|Other/gi, 'PC');
		// rename xbox series 
		platforms = platforms.replace('XBSX/XBSS', 'XBS');
		// remove empty values
		platforms = platforms.replace(/\s/g, '');
		platforms = platforms.split(',').filter((el) => { return el; });
		// remove duplicates
		platforms = [...new Set(platforms)];

		if (platforms.length <= 1) return;
		if(title === 'Linux') return;
		
		games.push({
			title,
			platforms
		});
	});
	
	return games;
};

const dewit = async () => {
	const today = dayjs();
	const games = await scrapWikipedia();

	const url = `https://id.twitch.tv/oauth2/token?client_id=${process.env['TWITCH_CLIENT']}&client_secret=${process.env['TWITCH_SECRET']}&grant_type=client_credentials`;
	const auth = await fetch(url, { method: 'POST' });
	const { access_token } = await auth.json();

	process.stdout.write(`\n`);
	const progressBarLength = 10;
	await asyncForEach(games, async (game, index) => {
		await sleep(wait);
		const igdb = await fetchIGDBDetails(access_token, game.title);

		// set game cover
		games[index].cover = igdb?.cover?.url != undefined ? `https://${igdb?.cover?.url.substring(2).replace('t_thumb', 't_cover_big')}` : null;

		// set game score
		games[index].score = igdb?.aggregated_rating ?? 0;

		// generate progress bar
		const elapsedTime = dayjs().diff(today);
		const averageTimePerIteration = elapsedTime / (index + 1);
		const remainingTime = averageTimePerIteration * (games.length - (index + 1));
		const remainingTimeFormatted = dayjs().add(remainingTime, 'ms').fromNow();
		
  	const progress = (index / games.length) * 100;
  	const bar = '⣀'.repeat(Math.round(progress / progressBarLength)) + ' '.repeat(progressBarLength - Math.round(progress / progressBarLength));

		process.stdout.clearLine();
  	process.stdout.cursorTo(0);
  	process.stdout.write(`[${bar}] ${Math.round(progress)}% | finishes ${remainingTimeFormatted} | ${index + 1}/${games.length} | ${game.title} (${game.score})`);
	});
	process.stdout.write(`\n`);

	await saveLocalData({ lastFetch: today.valueOf(), games });

	return games;
};

const fetchIGDBDetails = async (access_token, title) => {
	const response = await fetch(`https://api.igdb.com/v4/games`, {
		method: 'POST',
		headers: {
			'Client-ID': process.env['TWITCH_CLIENT'],
			'Authorization': `Bearer ${access_token}`,
		},
		body: `search "${title}"; fields name, aggregated_rating, cover.url; limit 1;`
	});

	const data = await response.json();
	return data[0];
};

const asyncForEach = async function (array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

dewit();