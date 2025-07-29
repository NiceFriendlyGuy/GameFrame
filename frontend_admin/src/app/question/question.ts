import { Component, inject } from '@angular/core';
import { Poll } from '../poll';
import { CommonModule } from '@angular/common';
import { HttpClientModule, httpResource } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question',
  imports: [],
  templateUrl: './question.html',
  styleUrl: './question.css'
})
export class Question {



 private Poll = inject(Poll);
  

  constructor(private route: ActivatedRoute, private router: Router) {}

  // ─── Poll State ───────────────────────────────────────────────────────────────
  pollId: string = "";
  poll: any;
  polls: any[] = [];

  screenshots: any[] = [];
  currentGuessScreenshot: string | null = null;

  isLoading: boolean = false;

  nextPoll: any;
  previousPoll: any;
  currentIndex: any;


  // ─── Game Metadata ────────────────────────────────────────────────────────────
  gameName = 'God of War';
  game: any = null;

  // ─── Image Modal ──────────────────────────────────────────────────────────────
  selectedImage: string | null = null;
  

  // ─── Search State ─────────────────────────────────────────────────────────────
  searchQuery = '';
  searchResults: any[] = [];
  selectedGameFromSearch: any = null;


  




ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pollId = params['id'];
      this.loadPoll(this.pollId); // create this helper function to handle loading logic
    });
  }

  loadPoll(pollId: string) {
    this.isLoading = true;
    this.selectedGameFromSearch = "";
    this.searchQuery = "";


    this.Poll.getPollById(pollId).subscribe(data => {
      this.poll = data;
      this.gameName = data.name;

      this.Poll.getGameByName(this.gameName).subscribe(gameData => {
        this.game = gameData;
        this.screenshots = (this.game?.screenshots || []).slice(0, 5);
        this.currentGuessScreenshot = this.game?.screenshots?.[0]?.url || null;
        this.isLoading = false;
        // Sort by date (make sure 'date' field exists and is ISO 8601 or comparable)
        const sortedPolls = [...this.polls].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        this.currentIndex = sortedPolls.findIndex(p => p._id === this.pollId); // Replace _id with your poll's unique identifier field
        this.nextPoll = sortedPolls[this.currentIndex + 1];
        this.previousPoll = sortedPolls[this.currentIndex - 1];
          });
    });

    this.Poll.getPolls().subscribe(data => {
      this.polls = data;
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
    
    this.searchQuery = game.name;
    this.searchResults = [];
  }

  
  selectImage(url: string | null) {
    this.currentGuessScreenshot = url;
  }

  goToNextPoll(): void {
    if (!this.pollId || this.polls.length === 0) return;


    if (this.nextPoll) {
      this.router.navigate(['/question', this.nextPoll._id]);
    } else {
      console.log('No next poll available.');
    }
  }

  goToPreviousPoll(): void {
    if (!this.pollId || this.polls.length === 0) return;

    

    if (this.previousPoll) {
      this.router.navigate(['/question', this.previousPoll._id]); 
    } else {
      console.log('No next poll available.');
    }
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

}
