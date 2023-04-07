import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GameService } from '../services/game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.html',
  imports: [
    CommonModule
  ]
})
export default class IndexComponent {

  public games$: Observable<any[]> = this.gameService.games();

  constructor(
    private gameService: GameService
  ) { }

  public ngOnInit(): void {
    this.gameService.getGames();
  }
}
