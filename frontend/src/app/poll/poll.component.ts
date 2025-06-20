import { Component, inject } from '@angular/core';
import { PollService } from '../../poll.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent {
  // ─── Dependencies ─────────────────────────────────────────────────────────────
  private pollService = inject(PollService);

  constructor(private route: ActivatedRoute, private auth:AuthService) {}

  // ─── Poll State ───────────────────────────────────────────────────────────────
  pollId: string | null = null;
  poll: any;
  polls: any[] = [];

  user: any = null;
  answeredPolls: any[] = [];

  selectedAnswer = '';
  answered = false;
  alreadyAnswered = false;
  guesses: string[] = []; // array to store guess history
  


  // ─── Game Metadata ────────────────────────────────────────────────────────────
  gameName = 'God of War';
  game: any = null;

  // ─── Image Modal ──────────────────────────────────────────────────────────────
  selectedImage: string | null = null;

  // ─── Search State ─────────────────────────────────────────────────────────────
  searchQuery = '';
  searchResults: any[] = [];
  selectedGameFromSearch: any = null;

  // ─── Lifecycle ────────────────────────────────────────────────────────────────
  ngOnInit(): void {
  this.pollId = this.route.snapshot.paramMap.get('id');
  this.user = this.auth.getUserEmail();

  if (this.user) {
    console.log('Logged in as:', this.user.email);
    // Fully backend mode for logged-in users
    this.pollService.getAnsweredQuestions().subscribe(data => {
      this.answeredPolls = data;

      if (this.pollId) {
        const poll = this.answeredPolls.find(p => p.pollId === this.pollId);
        if (poll) {
          this.alreadyAnswered = poll.answered;
          this.answered = poll.answered;
          this.guesses = poll.guesses.map((g: any) => g.answer);
          this.selectedAnswer = this.guesses[this.guesses.length - 1] || '';
        }
      }
    });
  } else {
    console.log('Guest user');
    // Use localStorage for guests
    if (this.pollId) {
      const answered = JSON.parse(localStorage.getItem('answeredQuestions') || '{}');
      const stored = answered[this.pollId];
      if (stored) {
        this.alreadyAnswered = true;
        this.answered = true;
        this.selectedAnswer = stored.selected;
      }
    }
  }

  // Always load full poll data
  if (this.pollId) {
    this.pollService.getPollById(this.pollId).subscribe(data => {
      this.poll = data;
      console.log('Fetched poll:', this.poll);
      this.gameName = data.name;

      this.pollService.getGameByName(this.gameName).subscribe(gameData => {
        this.game = gameData;
      });
    });
  }

  this.pollService.getPolls().subscribe(data => {
    this.polls = data;
  });
}



  // ─── Poll Answer Logic ────────────────────────────────────────────────────────
  selectAnswer(answerSelected: string): void {
  if (!this.pollId || this.answered) return;

  this.selectedAnswer = answerSelected;
  this.guesses.push(answerSelected); // local guess update

  this.pollService.addGuess(this.pollId, answerSelected).subscribe({
    next: () => {
      console.log('Guess recorded');

      // Refresh answeredPolls after new guess
      this.pollService.getAnsweredQuestions().subscribe(data => {
        this.answeredPolls = data;

        // Optionally update nbGuesses here
        const poll = this.answeredPolls.find(p => p.pollId === this.pollId);
      });

      if (answerSelected === this.poll.correctAnswer) {
        this.pollService.markPollAsAnswered(this.pollId!).subscribe({
          next: () => {
            console.log('Marked poll as answered');
            this.answered = true;
            this.alreadyAnswered = true;
          },
          error: err => console.error('Failed to mark poll as answered:', err)
        });
      }
    },
    error: err => {
      console.error('Error recording guess:', err);
    }
  });

  console.log('Clicked an answer:', answerSelected);
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

    if (query.length < 3) {
      this.searchResults = [];
      return;
    }

    this.pollService.searchGames(query).subscribe({
      next: results => this.searchResults = results,
      error: err => console.error('Search error:', err)
    });
  }

  selectGameFromSearch(game: any): void {
    this.selectedGameFromSearch = game;
    
    this.searchQuery = game.name;
    this.searchResults = [];
  }

  confirmSelectedAnswerFromSearch(selectedGameFromSearch: string): void{
    this.selectAnswer(this.selectedGameFromSearch.name);
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

  get totalGuesses(): number {
    const poll = this.answeredPolls.find(p => p.pollId === this.pollId);
    return poll?.guesses.length || 0;
  }


}
