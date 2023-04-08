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
			.get(`${import.meta.env['VITE_BASE_URL']}/games.json`)
			.subscribe({
				next: ({ games }: any) => {
					this.games$.next(games);
				},
				error: (e) => {
					console.error(e);
				}
			});
	}

	public games(): Observable<any> { return this.games$; }

	public gamesFiltered(platformA: string = '', platformB: string = ''): Observable<any> {
		return this.games$.pipe(
			map((all: any) => {
				let games = all;
				if (platformA !== '') games = games.filter((g: any) => g.platforms.includes(platformA));
				if (platformB !== '') games = games.filter((g: any) => g.platforms.includes(platformB));
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