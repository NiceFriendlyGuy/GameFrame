import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IGDB, IGDBGameList, Screenshots } from '../common/models/IGDB';
import { PollListResponse, Poll as PollModel } from '../common/models/poll';

@Component({
  selector: 'app-question',
  imports: [],
  templateUrl: './question.html',
  styleUrl: './question.scss'
})
export class Question {
  private route = inject(ActivatedRoute);

  readonly gameName = signal<string>('');
  readonly id = signal(null);
  readonly previousPoll = signal<PollModel | null>(null);
  readonly nextPoll = signal<PollModel | null>(null);
  readonly selectedGameFromSearch = signal<IGDB | null>(null);


  public polls: PollModel[] = [];

  public screenshots: Screenshots[] = [];
  public currentGuessScreenshot: string | null = null;

  //public isLoading: boolean = false;

  readonly isFullyLoaded = computed(() =>
    !!this.pollRessource.value() && !!this.IGDBRessource.value()
  );

  readonly searchQuery = signal<string>("");
  searchResults: any[] = [];
  public isSearchBoxOpen: boolean = false;


  public selectedImage: string | null = null;

  constructor(private router: Router) {
    //this.isLoading = true;

    effect(() => {
      const poll = this.pollRessource.value();
      if (!poll) return;
      this.gameName.set(poll.name);
      this.screenshots = (this.IGDBRessource?.value()?.screenshots || []).slice(0, 5);
      this.currentGuessScreenshot = this.IGDBRessource?.value()?.screenshots?.[0]?.url || null;
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

      const sortedList = [...list].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const index = sortedList.findIndex(poll => poll._id === currentId);

      this.previousPoll.set(index > 0 ? sortedList[index - 1] : null);
      this.nextPoll.set(index < sortedList.length - 1 ? sortedList[index + 1] : null);
    });


    /*effect(() => {
      this.isLoading = !this.isFullyLoaded();
    });*/
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

  readonly gameSearchResource = httpResource<IGDBGameList>(() => {
    const query = this.searchQuery().trim();
    return query.length > 2
      ? `http://localhost:3000/api/search/${encodeURIComponent(query)}`
      : undefined; // returning undefined skips the request
  });
  

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

  onSearchChange(query: string): void {
    if(query.length == 0){
      this.isSearchBoxOpen = false;
      return;
    }
    else if (query.length < 3) {
      this.isSearchBoxOpen = false;
      return;
    }
    this.isSearchBoxOpen = true;
    this.searchQuery.set(query);
  }

  selectGameFromSearch(game: any): void {
    this.selectedGameFromSearch.set(game.name);
    this.gameName.set(game.name);
    this.isSearchBoxOpen = false;
  }
}
