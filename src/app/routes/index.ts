import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

const DEFAULT_QUERY_PARAMS = {
  platformA: '',
  platformB: '',
  sortBy: 'name',
  q: ''
};

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.html',
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export default class IndexComponent {

  public gamesFiltered$: Observable<any[]> = this.gameService.gamesFiltered();
  public platforms$: Observable<any[]> = this.gameService.platforms();
  public games$: Observable<any[]> = this.gameService.games();

  public queryParams = DEFAULT_QUERY_PARAMS;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private meta: Meta
  ) { }

  private initMetatags(): void {
    const metaTitle = 'Crossplay Games | Game Browser';
    const metaDescription = 'Filter by platform to easily find crossplay games that are compatible with your preferences';

    this.meta.addTag({ name: 'title', content: metaTitle });
    this.meta.addTag({ name: 'description', content: metaDescription });

    // Open Graph / Facebook
    this.meta.addTag({ name: 'og:title', content: metaTitle });
    this.meta.addTag({ name: 'og:type', content: 'website' });
    this.meta.addTag({ name: 'og:type', content: 'website' });
    this.meta.addTag({ name: 'og:url', content: import.meta.env['VITE_BASE_URL'] });
    this.meta.addTag({ name: 'og:description', content: metaDescription });
    this.meta.addTag({ name: 'og:image', content: `${import.meta.env['VITE_BASE_URL']}/crossplay.png` });

    // Twitter
    this.meta.addTag({ name: 'twitter:title', content: metaTitle });
    this.meta.addTag({ name: 'twitter:description', content: metaDescription });
    this.meta.addTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.addTag({ name: 'twitter:url', content: import.meta.env['VITE_BASE_URL'] });
    this.meta.addTag({ name: 'twitter:image', content: `${import.meta.env['VITE_BASE_URL']}/crossplay.png` });
  }

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
    this.initMetatags();
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
