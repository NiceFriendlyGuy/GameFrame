import { Component } from '@angular/core';
import { HttpHeaders, httpResource } from '@angular/common/http';
import { DatePipe} from '@angular/common';
import { QuestionList } from '../common/models/questionModel';
import { Router } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-questions',
  imports: [DatePipe],
  templateUrl: './questions.html',
  styleUrl: './questions.scss'
})
export class Questions {


  public user: any = null;

  constructor(private router: Router, private auth:Auth) {}


  readonly questionListRessource = httpResource<QuestionList>(() =>
    `https://api.gameframe.ch/api/entries`
  );

  readonly answeredQuestionsResource = httpResource<any[]>(() => {
    const email = this.auth.getUserEmail()?.email;
    if (!email) return undefined;

    return {
      url: `https://api.gameframe.ch/api/users/answeredPolls`,
      headers: new HttpHeaders({
        'x-user-email': email
      })
    };
  });


  ngOnInit(): void {

    this.user = this.auth.getUserEmail();

  }


  navigateTo(page: string): void {
    this.router.navigate([page]);
  }

  getEmojiStatus(pollId: string): string {
  const poll = this.answeredQuestionsResource.value()?.find(p => p.pollId === pollId);
  if (!poll || !poll.guesses || poll.guesses.length === 0) {
    return '❓';
  }

  const lastGuess = poll.guesses[poll.guesses.length - 1];
  if (!lastGuess) return '❓';

  const fullPoll = this.questionListRessource.value()?.find(p => p._id === pollId);
  if (!fullPoll) return '❓'; 

  return lastGuess.answer === fullPoll.correctAnswer ? '✅' : '❌';
}
}
