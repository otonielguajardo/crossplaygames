// @ts-ignore
import { useStorage } from '#imports';
import { load } from 'cheerio';
import dayjs from 'dayjs';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
	const games = await fetchFromWikipedia();

	return {
		status: 200,
		data: games
	}
});

const fetchFromWikipedia = async () => {
	const data: any = await useStorage().getItem('src:server:data:wikipedia.json');

	const today = dayjs();
	const nextFetch = dayjs(data.lastFetch).add(5, 'second');
	const willFetch = today.isAfter(nextFetch);

	console.log({ nextFetch: nextFetch.format(), ____today: today.format(), willFetch });

	if (!willFetch) return data.games;

	const html = await fetch('https://en.wikipedia.org/wiki/List_of_video_games_that_support_cross-platform_play').then(res => res.text());
	const $ = load(html);
	let games: any = [];

	let title: string = '';
	$('table#softwarelist:first() tbody tr').each((rowIx, row) => {
		if (rowIx <= 2) return;

		let platforms: any = '';

		$(row).find('td').each((columnIx, column) => {
			if (columnIx == 0) {
				title = $(column).text().trim() != '' ? $(column).text().trim() : title;
			}
			if (columnIx >= 1 && columnIx <= 14) {
				platforms += $(column).text().trim() + ',';
			};
		});
		platforms = platforms.replace(/\s/g, '');
		platforms = platforms.split(',').filter((el: any) => { return el; });;

		games.push({
			title,
			platforms
		});
	});

	await useStorage().setItem('src:server:data:wikipedia.json', {
		lastFetch: dayjs().valueOf(),
		games
	});

	return games;
};

const fetchFromIGDB = async () => {

	// const data: any = await useStorage().getItem('src:server:data:wikipedia.json');


	const url = `https://id.twitch.tv/oauth2/token?client_id=${process.env['TWITCH_CLIENT']}&client_secret=${process.env['TWITCH_SECRET']}&grant_type=client_credentials`;
	const auth = await fetch(url, { method: 'POST' });
	const { access_token } = await auth.json();

	const response = await fetch(`https://api.igdb.com/v4/games`, {
		method: 'POST',
		headers: {
			'Client-ID': process.env['TWITCH_CLIENT'] as string,
			'Authorization': `Bearer ${access_token}`,
		},
		body: 'search "Zelda"; fields name, cover.url; limit 1;'
	});
	const data = await response.json();
	console.log(data);

	let games: any = [];
	return data;
};