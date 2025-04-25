import { Routes } from '@angular/router';
import { PollComponent } from './poll/poll.component'; // Adjust path if needed

export const routes: Routes = [
  {
    path: '',
    component: PollComponent // 👈 default route
  },
  {
    path: 'poll',
    component: PollComponent
  },
  // Add other routes here if needed
];
