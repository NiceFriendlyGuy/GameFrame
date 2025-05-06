import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private router: Router) {}
  title = 'frontend';

  navigateTo(page: string): void {
    console.log("Going to " + page);
    this.router.navigate([page]);
  }
}
