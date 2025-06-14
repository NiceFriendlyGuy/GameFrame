import { jwtDecode } from 'jwt-decode';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): { email: string} | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return { email: decoded.email };  // adjust to your token payload
    } catch (e) {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
