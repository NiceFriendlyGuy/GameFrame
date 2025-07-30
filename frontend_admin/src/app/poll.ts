import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Poll {

  private apiUrl = 'http://localhost:3000/api/entries';
  private apiAdminUrl = 'http://localhost:3000/api/admin/entries';


  constructor(private http: HttpClient) { }
  
  getPolls(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPollById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getGameByName(name: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/games/${name}`);
  }

  searchGames(query: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/search/${encodeURIComponent(query)}`);
  }

  createEntry(question: any): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No auth token found.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(this.apiAdminUrl, question, { headers });
}

}
