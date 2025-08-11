import { httpResource } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Question } from '../common/models/questionModel';
import { QuestionService } from '../question.service';


@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {


  constructor(private router: Router) {}


  private questionService = inject(QuestionService);


  readonly latestQuestionResource = httpResource<Question>(() => 
    'http://localhost:3000/api/entries/latest'
  );

  navigateTo(page: string): void {
    console.log("Going to " + page);
    this.router.navigate([page]);
  }

  clearAllAnwsers() {
    this.questionService.deleteAllAnswers().subscribe({
      next: (res) => {
        console.log('Poll answers deleted:', res);
      },
      error: (err) => {
        console.error('Error deleting answers:', err);
      }
    });
  }

}
