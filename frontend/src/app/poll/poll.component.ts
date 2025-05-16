import { Component, inject } from '@angular/core';
import { PollService } from '../../poll.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute

@Component({
  selector: 'app-poll',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent {
  pollId: string | null = null;
  poll: any;

  private pollService = inject(PollService);
  polls: any[] = [];

  constructor(private route: ActivatedRoute) {}

  answered = false;
  answer1 = "";
  answer2 = "";
  answer3 = "";
  answer4 = "";
  selectedAnswer = "";
  correctAnswer = "";
  question ="";
  alreadyAnswered = false;

  gameName = 'God of War';
  game: any = null;
  

  ngOnInit(): void {
    this.pollId = this.route.snapshot.paramMap.get('id');

    if (this.pollService.getAnswerStatus(this.pollId!) !== 'unanswered') {
      this.alreadyAnswered = true;
      this.answered = true;
    }

    
    if (this.pollId) {
      this.pollService.getPollById(this.pollId).subscribe(data => {
        this.poll = data;
        console.log('Fetched poll:', this.poll);

        // Now that the poll is fetched, set the values with the data
        this.answer1 = this.poll.answer1;
        this.answer2 = this.poll.answer2;
        this.answer3 = this.poll.answer3;
        this.answer4 = this.poll.answer4;
        this.correctAnswer = this.poll.correctAnswer;
        this.question = this.poll.question;
        this.gameName = this.poll.name;

        this.pollService.getGameByName(this.gameName).subscribe(gameData => {
          this.game = gameData;
        });
      });
    }



    // Fetch all polls if necessary (although you might not need this in this context)
    this.pollService.getPolls().subscribe(data => {
      this.polls = data;
    });
  }

  selectAnswer(answerSelected: string): void {
    if (!this.alreadyAnswered) {
      this.answered = true;
      this.selectedAnswer = answerSelected;
      this.pollService.markAsAnswered(this.pollId!, this.selectedAnswer, this.correctAnswer);
      this.alreadyAnswered = true;
      // continue with displaying results or posting to backend
    }
    console.log("Clicked an answer " + answerSelected);
    

    // You can add logic here to check if the selected answer is correct
  }

  

  
}
