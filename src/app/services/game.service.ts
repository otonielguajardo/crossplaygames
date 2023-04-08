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
			.get(`${process.env['BASE_URL']}/api/games`)
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

	public gamesFiltered(platformA: string = '', platformB: string = ''): Observable<any> {
		return this.games$.pipe(
			map((games: any) => {
				let gamesFiltered = games;
				if (platformA !== '') {
					gamesFiltered = gamesFiltered.filter((g: any) => g.platforms.includes(platformA))
				};
				if (platformB !== '') {
					gamesFiltered = gamesFiltered.filter((g: any) => g.platforms.includes(platformB))
				};
				return gamesFiltered;
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