import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../services/game.service';
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

  public games$: Observable<any[]> = this.gameService.games();
  public gamesFiltered$: Observable<any[]> = this.gameService.gamesFiltered();
  public platforms$: Observable<any[]> = this.gameService.platforms();

  public queryParams = DEFAULT_QUERY_PARAMS;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  public ngOnInit(): void {
    this.gameService.getGames();

    // listen to route change
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
