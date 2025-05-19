import { Component, inject } from '@angular/core';
import { PollService } from '../../poll.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent {
  pollId: string | null = null;
  poll: any;

  searchQuery = '';
  searchResults: any[] = [];
  selectedGameFromSearch: any = null;

  private pollService = inject(PollService);
  polls: any[] = [];

  constructor(private route: ActivatedRoute) {}

  answered = false;
  answer1 = "";
  answer2 = "";
  answer3 = "";
  answer4 = "";
  selectedAnswer = "";
  correctAnswer = "";
  question = "";
  alreadyAnswered = false;

  gameName = 'God of War';
  game: any = null;

  selectedImage: string | null = null;

  ngOnInit(): void {
    this.pollId = this.route.snapshot.paramMap.get('id');

    if (this.pollService.getAnswerStatus(this.pollId!) !== 'unanswered') {
      this.alreadyAnswered = true;
      this.answered = true;
    }

    if (this.pollId) {
      this.pollService.getPollById(this.pollId).subscribe(data => {
        this.poll = data;
        console.log('Fetched poll:', this.poll);

        this.answer1 = this.poll.answer1;
        this.answer2 = this.poll.answer2;
        this.answer3 = this.poll.answer3;
        this.answer4 = this.poll.answer4;
        this.correctAnswer = this.poll.correctAnswer;
        this.question = this.poll.question;
        this.gameName = this.poll.name;

        this.pollService.getGameByName(this.gameName).subscribe(gameData => {
          this.game = gameData;
        });
      });
    }

    this.pollService.getPolls().subscribe(data => {
      this.polls = data;
    });
  }

  onSearchChange(query: string) {
    this.searchQuery = query;

    if (query.length < 3) {
      this.searchResults = [];
      return;
    }

    this.pollService.searchGames(query).subscribe({
      next: results => {
        this.searchResults = results;
      },
      error: err => {
        console.error('Search error:', err);
      }
    });
  }

  selectGameFromSearch(game: any) {
    this.selectedGameFromSearch = game;
    this.searchQuery = game.name;
    this.searchResults = [];
  }

  selectAnswer(answerSelected: string): void {
    if (!this.alreadyAnswered) {
      this.answered = true;
      this.selectedAnswer = answerSelected;
      this.pollService.markAsAnswered(this.pollId!, this.selectedAnswer, this.correctAnswer);
      this.alreadyAnswered = true;
    }
    console.log("Clicked an answer " + answerSelected);
  }

  openImage(url: string) {
    this.selectedImage = url;
  }

  closeImage() {
    this.selectedImage = null;
  }
}
