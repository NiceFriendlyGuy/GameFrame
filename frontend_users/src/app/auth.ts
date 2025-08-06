import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { shareReplay } from 'rxjs/internal/operators/shareReplay';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class Auth {
  constructor(private http: HttpClient) {}

  private userCache$: Observable<any> | null = null;
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserEmail(): { email: string} | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return { email: decoded.email };  // adjust to your token payload
    } catch (e) {
      return null;
    }
  }

  getUser(): Observable<any | null> {
    if (this.userCache$) {
      return this.userCache$;
    }

    const email = this.getUserEmail()?.email || '';

    const headers = {
      'x-user-email': email
    };

    this.userCache$ = this.http.get(`/api/users`, { headers }).pipe(
      shareReplay(1)
    );

    return this.userCache$;
  }


  logout(): void {
    localStorage.removeItem('token');
  }
}
