// @ts-ignore
import { useStorage } from '#imports';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
	const data = await useStorage().getItem('src:server:data:games.json');

	return {
		status: 200,
		data: data.games
	}
});
