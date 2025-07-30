import { Component, computed, effect, inject, signal } from '@angular/core';
import { Poll } from '../poll';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IGDB, Screenshots } from '../common/models/IGDB';
import { httpResource } from '@angular/common/http';
import { PollListResponse, Poll as PollModel } from '../common/models/poll';

@Component({
  selector: 'app-new-question',
  imports: [],
  templateUrl: './new-question.html',
  styleUrl: './new-question.css'
})
export class NewQuestion {

  private route = inject(ActivatedRoute);

  private Poll = inject(Poll);

  readonly gameName = signal<string>('Cyberpunk 2077');
  readonly id = signal(null);
  readonly previousPoll = signal<PollModel | null>(null);
  readonly nextPoll = signal<PollModel | null>(null);

  public polls: PollModel[] = [];

  public screenshots: Screenshots[] = [];
  public currentGuessScreenshot: string | null = null;

  public isLoading: boolean = false;

  public selectedImage: string | null = null;

  searchQuery = '';
  searchResults: any[] = [];
  selectedGameFromSearch: any = null;
  


  constructor(private router: Router) {
    this.isLoading = true;

    effect(() => {
      const poll = this.IGDBRessource.value();
      if (!poll) return;
      this.gameName.set(poll.name);
      this.screenshots = (this.IGDBRessource?.value()?.screenshots || []).slice(0, 5);
      this.currentGuessScreenshot = this.IGDBRessource?.value()?.screenshots?.[0]?.url || null;
    });

   
    effect(() => {
      this.isLoading = !this.isFullyLoaded();
    });
  }


  readonly IGDBRessource = httpResource<IGDB>(() => {
    return this.gameName ? `http://localhost:3000/api/games/${this.gameName()}` : undefined;
  });

  readonly isFullyLoaded = computed(() =>
    !!this.IGDBRessource.value() && !!this.IGDBRessource.value()
  );


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
    this.searchQuery = query;
    if(query.length == 0){
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
    this.gameName.set(game.name);
    this.searchQuery = game.name;
    this.searchResults = [];
  }
  


 createNewEntry(): void {
  if (
    !this.gameName()
  ) {
    alert('Please fill in all required fields.');
    return;
  }

  const newEntry = {
    name: this.gameName(),
    correctAnswer: this.gameName(),
    date: new Date().toISOString() 
  };
  console.log('SENDING ENTRY:', newEntry);
  this.Poll.createEntry(newEntry).subscribe({
    next: (res) => {
      console.log('Entry created successfully:', res);
    },
    error: (err) => {
      console.error('Failed to create entry:', err);
      alert('There was an error saving the entry.');
    }
  });
}

}
