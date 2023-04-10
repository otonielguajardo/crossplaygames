import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GameService } from '../services/game.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RouteMeta } from '@analogjs/router';

const DEFAULT_QUERY_PARAMS = {
	platformA: '',
	platformB: '',
	sortBy: 'name',
	q: ''
};

const metaTitle = 'Crossplay Games | Browse Games';
const metaDescription = 'Filter by platform to easily find crossplay games that are compatible with your preferences';
export const routeMeta: RouteMeta = {
	meta: [
		{ name: 'author', content: 'Otoniel Guajardo' },
		{ name: 'title', content: metaTitle },
		{ name: 'description', content: metaDescription },
		{ property: 'og:title', content: metaTitle },
		{ property: 'og:description', content: metaDescription },
		{ property: 'og:type', content: 'website' },
		{ property: 'og:url', content: import.meta.env['VITE_BASE_URL'] },
		{ property: 'og:image', content: `${import.meta.env['VITE_BASE_URL']}/crossplay.png` },
		{ property: 'twitter:title', content: metaTitle },
		{ property: 'twitter:description', content: metaDescription },
		{ property: 'twitter:card', content: 'summary_large_image' },
		{ property: 'twitter:url', content: import.meta.env['VITE_BASE_URL'] },
		{ property: 'twitter:image', content: `${import.meta.env['VITE_BASE_URL']}/crossplay.png` },
	],
};

@Component({
	selector: 'app-home-page',
	standalone: true,
	templateUrl: './(home).html',
	imports: [
		CommonModule,
		FormsModule,
		RouterLink
	]
})
export default class HomePageComponent {

	public gamesFiltered$: Observable<any[]> = this.gameService.gamesFiltered();
	public platforms$: Observable<any[]> = this.gameService.platforms();

	public queryParams = DEFAULT_QUERY_PARAMS;

	constructor(
		private gameService: GameService,
		private route: ActivatedRoute,
		private router: Router
	) { }

	private initServices(): void {
		this.gameService.getGames();

		this.route.queryParams.subscribe((params) => {
			this.queryParams = {
				...DEFAULT_QUERY_PARAMS,
				...params
			};
			this.gamesFiltered$ = this.gameService.gamesFiltered(
				this.queryParams.platformA,
				this.queryParams.platformB,
				this.queryParams.sortBy,
				this.queryParams.q
			);
		});
	}

	public ngOnInit(): void {
		this.initServices();
	}

	public applyFilter(): void {
		this.router.navigate(['/'], { queryParams: this.queryParams });
	}

	public selectPlatform(platform: string): void {
		if (this.queryParams.platformA === platform) {
			this.queryParams.platformA = '';
		} else if (this.queryParams.platformB === platform) {
			this.queryParams.platformB = '';
		} else if (this.queryParams.platformA === '') {
			this.queryParams.platformA = platform;
		} else if (this.queryParams.platformB === '') {
			this.queryParams.platformB = platform;
		}
		this.applyFilter();
	}

	public selectedPlatform(platform: string): boolean {
		return this.queryParams.platformA === platform || this.queryParams.platformB === platform;
	}
}
