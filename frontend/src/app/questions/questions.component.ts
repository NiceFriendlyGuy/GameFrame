import { Component, inject } from '@angular/core';
import { PollService } from '../../poll.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-questions',
  imports: [CommonModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent {

  constructor(private router: Router, private auth:AuthService ) {}

  private pollService = inject(PollService);
  polls: any[] = [];
  user: any = null;

  answeredPolls: any[] = [];

  ngOnInit(): void {

    this.user = this.auth.getUserEmail();

    if (this.user) {
    this.pollService.getAnsweredQuestions().subscribe(data => {
      this.answeredPolls = data;
    });
  }

    this.pollService.getPolls().subscribe(data => {
      this.polls = data;
    });
  }

  navigateTo(page: string): void {
    console.log("Going to " + page);
    this.router.navigate([page]);
  }

  getEmojiStatus(pollId: string): string {
  const poll = this.answeredPolls.find(p => p.pollId === pollId);
  if (!poll || !poll.guesses || poll.guesses.length === 0) {
    return '❓';
  }

  const lastGuess = poll.guesses[poll.guesses.length - 1];
  if (!lastGuess) return '❓';

  // Now find the correct answer from polls list
  const fullPoll = this.polls.find(p => p._id === pollId);
  if (!fullPoll) return '❓'; // can't find poll data

  return lastGuess.answer === fullPoll.correctAnswer ? '✅' : '❌';
}



  

}
