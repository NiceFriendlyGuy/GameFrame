import { Component, inject } from '@angular/core';
import { AdminUsersService } from '../admin-users'; 
import { CommonModule } from '@angular/common'; // Required for *ngFor, etc.
import { Poll } from '../poll';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, httpResource } from '@angular/common/http';
import { PollListResponse } from '../common/models/poll';
import { UserListResponse } from '../common/models/user';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // <-- Add CommonModule for structural directives
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  users: any[] = []; // <-- Make `users` public so the template can access it
  polls: any[] = [];
  constructor(private adminUsers: AdminUsersService, private router: Router, private http: HttpClient) {}

  readonly pollRessource = httpResource<PollListResponse>(() =>
    `http://localhost:3000/api/entries`
  );

  readonly userListResource = httpResource<UserListResponse>(() => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token found.');

    return {
      url: `http://localhost:3000/api/admin/users/findAll`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  });

  navigateTo(page: string): void {
    console.log("Going to " + page);
    this.router.navigate([page]);
  }
}
