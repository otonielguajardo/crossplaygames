import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
	return {
		status: 200,
		data: 'ok'
	}
});