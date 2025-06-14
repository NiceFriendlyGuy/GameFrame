import { Routes } from '@angular/router';
import { PollComponent } from './poll/poll.component';
import { HomeComponent } from './home/home.component';
import { QuestionsComponent } from './questions/questions.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'poll/:id',
    component: PollComponent
  },
  {
    path: 'questions',
    component: QuestionsComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  }

];
