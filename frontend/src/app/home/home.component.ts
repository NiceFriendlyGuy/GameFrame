import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PollService } from '../../poll.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  todayID = "67f90b157027bd6cca6b140b";

  private pollService = inject(PollService);
  polls: any[] = [];

  latestPollId: string | null = null;


  constructor(private router: Router) {}

  ngOnInit(): void {
    this.pollService.getPolls().subscribe(data => {
      this.polls = data;
    });
    this.pollService.getLatestPoll().subscribe(poll => {
      if (poll && poll._id) {
        this.latestPollId = poll._id;  // Store it as a string
        console.log('Latest poll ID:', this.latestPollId);
      }
    });
  }

  navigateTo(page: string): void {
    console.log("Going to " + page);
    this.router.navigate([page]);
  }

  clearAllAnwsers() {
    this.pollService.deleteAllAnswers().subscribe({
      next: (res) => {
        console.log('Poll answers deleted:', res);
        // Optionally: show a success message or refresh UI
      },
      error: (err) => {
        console.error('Error deleting answers:', err);
        // Optionally: show an error message to the user
      }
    });
  }

}
