import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private apiUrl = 'http://localhost:3000/api/entries';
  private userApiUrl = 'http://localhost:3000/api/users';
  private storageKey = 'answeredQuestions';

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Get all polls
  getPolls(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPollById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getLatestPoll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/latest`);
  }

  addGuess(pollId: string, guess: string): Observable<any> {
    const email = this.auth.getUserEmail()?.email || '';
    const headers = { 'x-user-email': email };

    return this.http.post(`${this.userApiUrl}/guess`, { pollId, guess }, { headers });
  }

  markPollAsAnswered(pollId: string): Observable<any> {
    const email = this.auth.getUserEmail()?.email || '';
    const headers = new HttpHeaders({
      'x-user-email': email
    });

    return this.http.post(`${this.userApiUrl}/mark-answered`, { pollId }, { headers });
  }

  deleteAllAnswers(): Observable<any> {
    const email = this.auth.getUserEmail()?.email || '';
    const headers = new HttpHeaders({ 'x-user-email': email });

    return this.http.delete(`${this.userApiUrl}/deleteAll`, { headers });
  }

  getAnsweredQuestions(): Observable<any[]> {
  const email = this.auth.getUserEmail()?.email;
  if (!email) return of([]);

  const headers = new HttpHeaders({
    'x-user-email': email
  });

  return this.http.get<any[]>(`${this.userApiUrl}/answeredPolls`, { headers });
}


 getAnswerStatus(pollId: string): Observable<'correct' | 'incorrect' | 'unanswered'> {
  return this.getAnsweredQuestions().pipe(
    map((answers: any[]) => {
      const poll = answers.find(p => p.pollId === pollId);
      if (!poll) return 'unanswered';
      if (!poll.answered) return 'unanswered';
      const lastGuess = poll.guesses[poll.guesses.length - 1];
      if (!lastGuess) return 'unanswered';
      return lastGuess.answer === poll.correctAnswer ? 'correct' : 'incorrect';
    })
  );
}


  markAsAnswered(pollId: string): void {
    const email = this.auth.getUserEmail()?.email;

    if (!email) {
      // Guests still store in localStorage
      const localData = localStorage.getItem(this.storageKey);
      const answered = localData ? JSON.parse(localData) : {};
      answered[pollId] = {};
      localStorage.setItem(this.storageKey, JSON.stringify(answered));
    } else {
      // Future: Backend can handle additional mark-answered if needed
      this.markPollAsAnswered(pollId).subscribe();
    }
  }

  clearAnswered(): void {
    localStorage.removeItem(this.storageKey);
  }

  getGameByName(name: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/games/${name}`);
  }

  searchGames(query: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/search/${encodeURIComponent(query)}`);
  }
}
