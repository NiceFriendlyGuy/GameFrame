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

  question = '';
  answer1 = '';
  answer2 = '';
  answer3 = '';
  answer4 = '';
  correctAnswer = '';
  selectedAnswer = '';
  answered = false;
  alreadyAnswered = false;

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

  this.user = this.auth.getUser();

  if (this.user) {
    console.log('Logged in as:', this.user.email);
    // Load user progress from backend if needed
  } else {
    console.log('Guest user');
    // Use localStorage
  }


  if (this.pollId) {
    const status = this.pollService.getAnswerStatus(this.pollId);
    if (status !== 'unanswered') {
      this.alreadyAnswered = true;
      this.answered = true;

      const stored = this.pollService.getAnsweredQuestions()[this.pollId];
      this.selectedAnswer = stored?.selected || '';
    }

    this.pollService.getPollById(this.pollId).subscribe(data => {
      this.poll = data;
      console.log('Fetched poll:', this.poll);

      this.answer1 = data.answer1;
      this.answer2 = data.answer2;
      this.answer3 = data.answer3;
      this.answer4 = data.answer4;
      this.correctAnswer = data.correctAnswer;
      this.question = data.question;
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
    if (!this.alreadyAnswered) {
      this.answered = true;
      this.selectedAnswer = answerSelected;
      this.pollService.markAsAnswered(this.pollId!, answerSelected, this.correctAnswer);
      this.alreadyAnswered = true;
    }
    console.log("Clicked an answer", answerSelected);
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
}
