import { Component, inject } from '@angular/core';
import { PollService } from '../../poll.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-poll',
  imports: [CommonModule,HttpClientModule],
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css'
})
export class PollComponent {
  pollId: string | null = null;

  private pollService = inject(PollService);
  polls: any[] = [];

  answered = false;
  selectedAnswer = 0;
  correctAnswer = 1;

  ngOnInit(): void {
    this.pollService.getPolls().subscribe(data => {
      this.polls = data;
    });
  }

  selectAnswer(answerNum: number): void {
    console.log("Clicked an answer" + answerNum);
    this.answered = true;
    this.selectedAnswer = answerNum;
  }

  
}
