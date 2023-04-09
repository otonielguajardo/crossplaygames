import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameService {

	private games$ = new BehaviorSubject<any>([]);

	constructor(
		private httpClient: HttpClient
	) { }

	public getGames(): void {
		this.httpClient
			.get(`${import.meta.env['VITE_BASE_URL']}/api/games`)
			.subscribe({
				next: ({ data }: any) => {
					this.games$.next(data);
				},
				error: (e) => {
					console.error(e);
				}
			});
	}

	public games(): Observable<any> { return this.games$; }

	public gamesFiltered(platformA: string = '', platformB: string = '', sortBy: string = 'name', q: string = ''): Observable<any> {
		return this.games$.pipe(
			map((all: any) => {
				let games = all;

				// platforms
				if (platformA !== '') games = games.filter((g: any) => g.platforms.includes(platformA));
				if (platformB !== '') games = games.filter((g: any) => g.platforms.includes(platformB));

				// sort
				if (sortBy === 'name') {
					games.sort((a: any, b: any) => {
						if (a.title < b.title) return -1;
						if (a.title > b.title) return 1;
						return 0;
					});
				}
				if (sortBy === 'rating') games = games.sort((a: any, b: any) => b.rating - a.rating);

				// search
				if (q !== '') games = games.filter((g: any) => g.title.toLowerCase().includes(q.toLowerCase()));

				return games;
			})
		);
	}

	public platforms(): Observable<any> {
		return this.games$.pipe(
			map((games: any) => {
				let patforms = games.map((game: any) => game.platforms).flat();
				return ['', ...new Set(patforms)];
			})
		);
	}
}