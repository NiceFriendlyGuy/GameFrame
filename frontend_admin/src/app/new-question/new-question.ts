import { Component, inject } from '@angular/core';
import { Poll } from '../poll';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-question',
  imports: [],
  templateUrl: './new-question.html',
  styleUrl: './new-question.css'
})
export class NewQuestion {

  private Poll = inject(Poll);

  constructor(private route: ActivatedRoute, private router: Router) {}

  // ─── Poll State ───────────────────────────────────────────────────────────────
  screenshots: any[] = [];
  currentGuessScreenshot: string | null = null;
  isLoading: boolean = false;


  // ─── Game Metadata ────────────────────────────────────────────────────────────
  gameName = 'Cyberpunk 2077';
  game: any = null;
  date: any = null;

  // ─── Image Modal ──────────────────────────────────────────────────────────────
  selectedImage: string | null = null;
  

  // ─── Search State ─────────────────────────────────────────────────────────────
  searchQuery = '';
  searchResults: any[] = [];
  selectedGameFromSearch: any = null;
  

ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadGame(this.gameName); 
    });
  }

  loadGame(gameName: string) {
    this.isLoading = true;
    this.selectedGameFromSearch = "";
    this.searchQuery = "";

    this.Poll.getGameByName(gameName).subscribe(gameData => {
      this.game = gameData;
      this.screenshots = (this.game?.screenshots || []).slice(0, 5);
      this.currentGuessScreenshot = this.game?.screenshots?.[0]?.url || null;
      this.isLoading = false;
    });

  }

  // ─── Image Viewer ─────────────────────────────────────────────────────────────
  openImage(url: string): void {
    this.selectedImage = url;
  }

  closeImage(): void {
    this.selectedImage = null;
  }

  // ─── Search Game Logic ────────────────────────────────────────────────────────
  onSearchChange(query: string): void {
    this.searchQuery = query;
    if(query.length == 0){
      this.searchResults = [];
      this.selectedGameFromSearch = "";
    }
    else if (query.length < 3) {
      this.searchResults = [];
      return;
    }

    this.Poll.searchGames(query).subscribe({
      next: results => this.searchResults = results,
      error: err => console.error('Search error:', err)
    });
  }

  selectGameFromSearch(game: any): void {
    this.selectedGameFromSearch = game;
    this.gameName = game.name;
    this.loadGame(this.gameName);
    this.searchQuery = game.name;
    this.searchResults = [];
  }

  
  selectImage(url: string | null) {
    this.currentGuessScreenshot = url;
  }


  get firstScreenshot() {
    return this.game?.screenshots?.[0] || null;
  }

  get secondScreenshot() {
    return this.game?.screenshots?.[1] || null;
  }

  get thirdScreenshot() {
    return this.game?.screenshots?.[2] || null;
  }

  get fourthScreenshot() {
    return this.game?.screenshots?.[3] || null;
  }

  get fifthScreenshot() {
    return this.game?.screenshots?.[4] || null;
  }


 createNewEntry(): void {
  if (
    !this.gameName
  ) {
    alert('Please fill in all required fields.');
    return;
  }

  const newEntry = {
    name: this.gameName,
    correctAnswer: this.gameName,
    date: new Date().toISOString() // optional: fallback to current date
  };
  console.log('SENDING ENTRY:', newEntry);
  this.Poll.createEntry(newEntry).subscribe({
    next: (res) => {
      console.log('Entry created successfully:', res);
    },
    error: (err) => {
      console.error('Failed to create entry:', err);
      alert('There was an error saving the entry.');
    }
  });
}

}
