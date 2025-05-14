import { Component, inject } from '@angular/core';
import { PollService } from '../../poll.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-questions',
  imports: [CommonModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent {

  constructor(private router: Router) {}

  private pollService = inject(PollService);
  polls: any[] = [];

  ngOnInit(): void {
    this.pollService.getPolls().subscribe(data => {
      this.polls = data;
    });
  }

  navigateTo(page: string): void {
    console.log("Going to " + page);
    this.router.navigate([page]);
  }

  getEmojiStatus(pollId: string): string {
    const status = this.pollService.getAnswerStatus(pollId);
    if (status === 'correct') return '✅';
    if (status === 'incorrect') return '❌';
    return '❓';
  }
  

}
