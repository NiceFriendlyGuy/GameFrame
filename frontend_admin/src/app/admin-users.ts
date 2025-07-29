import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  private adminApiUrl = '';

  constructor(private http: HttpClient, private auth: AuthService) {}

}
