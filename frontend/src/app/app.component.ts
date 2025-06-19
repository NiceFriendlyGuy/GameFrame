import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  user: any = null;

  constructor(private router: Router, private auth:AuthService) {}
  title = 'frontend';

  navigateTo(page: string): void {
    console.log("Going to " + page);
    this.router.navigate([page]);
  }

  ngOnInit(): void {
    this.user = this.auth.getUserEmail();

    if (this.user) {
      console.log('Logged in as:', this.user.email);
      // Load user progress from backend if needed
    } else {
      console.log('Guest user');
      // Use localStorage
    }
  }

  logout(): void {
    this.auth.logout();
    this.user = null;
    window.location.reload();
  }

}
