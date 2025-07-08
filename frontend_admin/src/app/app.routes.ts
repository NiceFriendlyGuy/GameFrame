import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Question } from './question/question';
import { NewQuestion } from './new-question/new-question';


export const routes: Routes = [
    { path: 'new', component: NewQuestion},
    { path: 'question/:id', component: Question },
    { path: 'dashboard', component: Dashboard },
    { path: 'login', component: Login },
    { path: '**', redirectTo: 'login' }];
