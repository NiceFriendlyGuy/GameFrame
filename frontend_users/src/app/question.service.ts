import { Injectable } from '@angular/core';
import { Auth } from './auth';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private userApiUrl = 'https://api.gameframe.ch/api/users';
  constructor(private http: HttpClient, private auth: Auth) {}

  private headers() {
    const email = this.auth.getUserEmail()?.email ?? '';
    return { headers: new HttpHeaders({ 'x-user-email': email }) };
  }

  addGuess(pollId: string, guess: string) {
    return this.http.post(`${this.userApiUrl}/guess`, { pollId, guess }, this.headers());
  }

  markPollAsAnswered(pollId: string) {
    return this.http.post(`${this.userApiUrl}/mark-answered`, { pollId }, this.headers());
  }

  deleteAllAnswers() {
    return this.http.delete(`${this.userApiUrl}/deleteAll`, this.headers());
  }
}
