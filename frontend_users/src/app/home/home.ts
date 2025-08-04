import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Question } from '../common/models/questionModel';


@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {


  constructor(private router: Router) {}


  readonly latestQuestionResource = httpResource<Question>(() => 
    'http://localhost:3000/api/entries/latest'
  );

  navigateTo(page: string): void {
    console.log("Going to " + page);
    this.router.navigate([page]);
  }

}
