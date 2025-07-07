import { Component } from '@angular/core';
import { AdminUsersService } from '../admin-users'; 
import { CommonModule } from '@angular/common'; // Required for *ngFor, etc.

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // <-- Add CommonModule for structural directives
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  users: any[] = []; // <-- Make `users` public so the template can access it

  constructor(private adminUsers: AdminUsersService) {}

  ngOnInit(): void {
    this.adminUsers.getUsers().subscribe({
      next: data => {
        this.users = data;
      },
      error: err => {
        console.error('Failed to load users:', err);
      }
    });
  }
}
