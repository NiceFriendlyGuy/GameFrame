import { Routes } from '@angular/router';
import { Question } from './question/question';
import { Home} from './home/home';
import { Questions } from './questions/questions';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'question/:id',
    component: Question
  },
  {
    path: 'questions',
    component: Questions
  },
  {
    path: 'home',
    component: Home
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then(m => m.Login)
  }

];
