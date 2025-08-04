import { Component } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { DatePipe} from '@angular/common';
import { QuestionList } from '../common/models/questionModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questions',
  imports: [DatePipe],
  templateUrl: './questions.html',
  styleUrl: './questions.scss'
})
export class Questions {

  constructor(private router: Router) {}


  readonly questionListRessource = httpResource<QuestionList>(() =>
    `http://localhost:3000/api/entries`
  );


  navigateTo(page: string): void {
    console.log("Going to " + page);
    this.router.navigate([page]);
  }
}
