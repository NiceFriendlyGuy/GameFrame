import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class PollService {
  private apiUrl = 'http://localhost:3000/api/entries'; // Your backend API

  constructor(private http: HttpClient) {}

  // Get all polls
  getPolls(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}