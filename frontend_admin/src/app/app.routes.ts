import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    { path: 'dashboard', component: Dashboard },
    { path: 'login', component: Login },
    { path: '**', redirectTo: 'login' }];
