import { Component, inject } from '@angular/core';
import { PollService } from '../../poll.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-poll',
  imports: [CommonModule,HttpClientModule],
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css'
})
export class PollComponent {
  private pollService = inject(PollService);
  polls: any[] = [];

  ngOnInit(): void {
    this.pollService.getPolls().subscribe(data => {
      this.polls = data;
    });
  }
}
