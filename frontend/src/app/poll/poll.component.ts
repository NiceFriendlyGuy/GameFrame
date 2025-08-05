import { Component, inject } from '@angular/core';
import { PollService } from '../../poll.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

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
  

  constructor(private route: ActivatedRoute, private auth:AuthService, private router: Router) {}

  // ─── Poll State ───────────────────────────────────────────────────────────────
  pollId: string = "";
  poll: any;
  polls: any[] = [];

  user: any = null;
  answeredPolls: any[] = [];

  selectedAnswer = '';
  answered = false;
  alreadyAnswered = false;
  guesses: string[] = []; // array to store guess history

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

  // ─── Lifecycle ────────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pollId = params['id'];
      this.loadPoll(this.pollId); // create this helper function to handle loading logic
    });
  }

  loadPoll(pollId: string) {
    this.isLoading = true;
    this.user = this.auth.getUserEmail();
    this.answered = false;
    this.guesses = [];
    this.selectedGameFromSearch = "";
    this.searchQuery = "";

    if (this.user) {
      this.pollService.getAnsweredQuestions().subscribe(data => {
        this.answeredPolls = data;

        const poll = this.answeredPolls.find(p => p.pollId === pollId);
        if (poll) {
          this.alreadyAnswered = poll.answered;
          this.answered = poll.answered;
          this.guesses = poll.guesses.map((g: any) => g.answer);
          this.selectedAnswer = this.guesses[this.guesses.length - 1] || '';
        }
      });
    } else {
      const answered = JSON.parse(localStorage.getItem('answeredQuestions') || '{}');
      const stored = answered[pollId];
      if (stored) {
        this.alreadyAnswered = true;
        this.answered = true;
        this.selectedAnswer = stored.selected;
      }
    }

    this.pollService.getPollById(pollId).subscribe(data => {
      this.poll = data;
      this.gameName = data.name;

      this.pollService.getGameByName(this.gameName).subscribe(gameData => {
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
        if(this.totalGuesses <= 4){
          console.log(this.screenshots?.[this.totalGuesses].url);
          this.selectImage(this.screenshots?.[this.totalGuesses].url); 
        }
        const poll = this.answeredPolls.find(p => p.pollId === this.pollId);
        
        console.log(this.totalGuesses);
        if (answerSelected === this.poll.correctAnswer || this.totalGuesses > 4) {
          this.pollService.markPollAsAnswered(this.pollId!).subscribe({
            next: () => {
              console.log('Marked poll as answered');
              this.answered = true;
              this.alreadyAnswered = true;
            },
            error: err => console.error('Failed to mark poll as answered:', err)
          });
        }

      });

      
      
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
    if(query.length == 0){
      this.searchResults = [];
      this.selectedGameFromSearch = "";
    }
    else if (query.length < 3) {
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
    this.selectedGameFromSearch = "";
    this.searchQuery = "";
  }

  
  selectImage(url: string | null) {
    this.currentGuessScreenshot = url;
  }

  goToNextPoll(): void {
    if (!this.pollId || this.polls.length === 0) return;

    

    if (this.nextPoll) {
      this.router.navigate(['/poll', this.nextPoll._id]);
    } else {
      console.log('No next poll available.');
    }
  }

  goToPreviousPoll(): void {
    if (!this.pollId || this.polls.length === 0) return;

    

    if (this.previousPoll) {
      this.router.navigate(['/poll', this.previousPoll._id]); 
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

  get totalGuesses(): number {
    const poll = this.answeredPolls.find(p => p.pollId === this.pollId);
    return poll?.guesses.length || 0;
  }


}
