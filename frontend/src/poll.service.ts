import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class PollService {
  private apiUrl = 'http://localhost:3000/api/entries'; // Your backend API

  constructor(private http: HttpClient) { }

  // Get all polls
  getPolls(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Method to fetch a specific poll by its ID
  getPollById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getLatestPoll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/latest`);
  }

  private storageKey = 'answeredQuestions';

  // Save the selected answer
  markAsAnswered(pollId: string, selectedAnswer: string, correctAnswer: string): void {
    const answered = this.getAnsweredQuestions();
    answered[pollId] = {
      selected: selectedAnswer,
      correct: correctAnswer
    };
    localStorage.setItem(this.storageKey, JSON.stringify(answered));
  }

  getAnsweredQuestions(): Record<string, { selected: string, correct: string }> {
    return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
  }

  getAnswerStatus(pollId: string): 'correct' | 'incorrect' | 'unanswered' {
    const answers = this.getAnsweredQuestions();
    if (!answers[pollId]) return 'unanswered';
    return answers[pollId].selected === answers[pollId].correct ? 'correct' : 'incorrect';
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