import { Component, inject } from '@angular/core';
import { AdminUsersService } from '../admin-users'; 
import { CommonModule } from '@angular/common'; // Required for *ngFor, etc.
import { Poll } from '../poll';

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

  private pollService = inject(Poll);
  

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

    this.pollService.getPolls().subscribe(data => {
      this.polls = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  }

  
}
