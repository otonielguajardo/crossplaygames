import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameService {

	private games$ = new BehaviorSubject<any>([]);

	// private get cachedGames() {
	// 	const cachedGames = localStorage.getItem('games') as string;
	// 	return JSON.parse(cachedGames) ?? [];
	// }

	// private set cachedGames(data) {
	// 	if (data) localStorage.setItem('games', JSON.stringify(data));
	// }

	constructor(
		private httpClient: HttpClient
	) { }

	public getGames(): void {
		// this.games$.next(this.cachedGames);

		this.httpClient
			.get(`http://localhost:5173/api/games`)
			.subscribe({
				next: ({ data }: any) => {
					// console.log(response);
					this.games$.next(data);
					// this.cachedGames = data;
				},
				error: (e) => {
					console.error(e);
				}
			});
	}

	public games(): Observable<any> { return this.games$; }
}