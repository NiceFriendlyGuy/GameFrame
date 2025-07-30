import { Component, effect, inject, signal } from '@angular/core';
import { Poll } from '../poll';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PollListResponse, Poll as PollModel } from '../common/models/poll';
import { IGDB } from '../common/models/IGDB';


@Component({
  selector: 'app-question',
  imports: [],
  templateUrl: './question.html',
  styleUrl: './question.css'
})
export class Question {
  private Poll = inject(Poll);
  private route = inject(ActivatedRoute);


  public gameName = signal<string>('');

  public id = signal(this.route.snapshot.paramMap.get('id'));



  previousPoll = signal<PollModel | null>(null);
  nextPoll = signal<PollModel | null>(null);

 


  constructor(private router: Router) {
    this.isLoading = true;

    effect(() => {

      const poll = this.pollRessource.value();
      if (!poll) return;
      this.gameName.set(poll.name);
      this.screenshots = (this.IGDBRessource?.value()?.screenshots || []).slice(0, 5);
      this.currentGuessScreenshot = this.IGDBRessource?.value()?.screenshots?.[0]?.url || null;
      this.isLoading = false;
    });

    effect(() => {
      const pollList = this.pollListRessource.value();
      if (!pollList) return;
      this.polls = pollList;
    });


    effect(() => {
      const list = this.pollListRessource.value();
      const currentId = this.id();

      if (!list || !currentId) return;

      // Optional: sort list by date or whatever your intended order is
      const sortedList = [...list].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const index = sortedList.findIndex(poll => poll._id === currentId);

      this.previousPoll.set(index > 0 ? sortedList[index - 1] : null);
      this.nextPoll.set(index < sortedList.length - 1 ? sortedList[index + 1] : null);
    });

  }

  readonly pollListRessource = httpResource<PollListResponse>(() =>
    `http://localhost:3000/api/entries`
  );

  readonly pollRessource = httpResource<PollModel>(() =>
    `http://localhost:3000/api/entries/${this.id()}`
  );

  readonly IGDBRessource = httpResource<IGDB>(() => {
    const poll = this.pollRessource.value();
    return poll?.name ? `http://localhost:3000/api/games/${poll.name}` : undefined;
  });



  // ─── Poll State ───────────────────────────────────────────────────────────────
  poll: any;
  polls: any[] = [];

  screenshots: any[] = [];
  currentGuessScreenshot: string | null = null;

  isLoading: boolean = false;

  currentIndex: any;


  // ─── Game Metadata ────────────────────────────────────────────────────────────

  // ─── Image Modal ──────────────────────────────────────────────────────────────
  selectedImage: string | null = null;


  // ─── Search State ─────────────────────────────────────────────────────────────
  searchQuery = '';
  searchResults: any[] = [];
  selectedGameFromSearch: any = null;




  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id.set(params['id']);
    });
  }

  // ─── Image Viewer ─────────────────────────────────────────────────────────────
  openImage(url: string | undefined | null): void {
    if (url !== undefined) {
      this.selectedImage = url;
    }
  }

  closeImage(): void {
    this.selectedImage = null;
  }

  // ─── Search Game Logic ────────────────────────────────────────────────────────
  onSearchChange(query: string): void {
    this.searchQuery = query;
    if (query.length == 0) {
      this.searchResults = [];
      this.selectedGameFromSearch = "";
    }
    else if (query.length < 3) {
      this.searchResults = [];
      return;
    }

    this.Poll.searchGames(query).subscribe({
      next: results => this.searchResults = results,
      error: err => console.error('Search error:', err)
    });
  }

  selectGameFromSearch(game: any): void {
    this.selectedGameFromSearch = game;

    this.searchQuery = game.name;
    this.searchResults = [];
  }


  selectImage(url: string | null) {
    this.currentGuessScreenshot = url;
  }

  goToNextPoll(): void {
    if (!this.id() || this.polls.length === 0) return;

    if (this.nextPoll()?._id) {
      this.router.navigate(['/question', this.nextPoll()?._id]);
    } else {
      console.log('No next poll available.');
    }
  }

  goToPreviousPoll(): void {
    if (!this.id() || this.polls.length === 0) return;

    if (this.previousPoll()?._id) {
      this.router.navigate(['/question', this.previousPoll()?._id]);
    } else {
      console.log('No next poll available.');
    }
  }

}
