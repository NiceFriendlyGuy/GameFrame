import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  private adminApiUrl = 'http://localhost:3000/api/admin';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getUsers(): Observable<any[]> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No auth token found.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.adminApiUrl}/users/findAll`, { headers });
  }
}
