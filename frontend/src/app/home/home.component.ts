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


  constructor(private router: Router) {}

  ngOnInit(): void {
    this.pollService.getPolls().subscribe(data => {
      this.polls = data;
    });
  }

  navigateTo(page: string): void {
    console.log("Going to " + page);
    this.router.navigate([page]);
  }
}
