import { Component, computed, effect, inject, signal } from '@angular/core';
import { Poll } from '../poll';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IGDB, IGDBGameList, Screenshots } from '../common/models/IGDB';
import { httpResource } from '@angular/common/http';
import { Poll as PollModel } from '../common/models/poll';

import {ChangeDetectionStrategy} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-new-question',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './new-question.html',
  styleUrl: './new-question.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewQuestion {

  private route = inject(ActivatedRoute);

  private Poll = inject(Poll);

  readonly gameName = signal<string>('Cyberpunk 2077');
  readonly id = signal(null);
  readonly previousPoll = signal<PollModel | null>(null);
  readonly nextPoll = signal<PollModel | null>(null);
  readonly selectedGameFromSearch = signal<IGDB | null>(null);
  readonly selectedDate = signal<Date | null>(null);


  public polls: PollModel[] = [];

  public screenshots: Screenshots[] = [];
  public currentGuessScreenshot: string | null = null;

  readonly isLoading = computed(() => !this.isFullyLoaded());
  public isSearchBoxOpen: boolean = false;

  public selectedImage: string | null = null;

  readonly searchQuery = signal<string>("");
  searchResults: any[] = [];
  //selectedGameFromSearch: any = null;
  


  constructor(private router: Router) {
    //this.isLoading = true;

    effect(() => {
      const poll = this.IGDBRessource.value();
      if (!poll) return;
      this.gameName.set(poll.name);
      this.screenshots = (this.IGDBRessource?.value()?.screenshots || []).slice(0, 5);
      this.currentGuessScreenshot = this.IGDBRessource?.value()?.screenshots?.[0]?.url || null;
    });

    effect(()=>{
      console.log(this.selectedDate());
    })
   

  }


  readonly IGDBRessource = httpResource<IGDB>(() => {
    return this.gameName ? `https://api.gameframe.ch/api/games/${this.gameName()}` : undefined;
  });

  readonly isFullyLoaded = computed(() =>
    !!this.IGDBRessource.value()
  );

  readonly gameSearchResource = httpResource<IGDBGameList>(() => {
    const query = this.searchQuery().trim();
    return query.length > 2
      ? `https://api.gameframe.ch/api/search/${encodeURIComponent(query)}`
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


  onDateChange(event: any): void {
    this.selectedDate.set(event.value);
  }


 createNewEntry(): void {
  if (
    !this.gameName() || !this.selectedDate()
  ) {
    alert('Please fill in all required fields.');
    return;
  }

  const newEntry = {
    name: this.gameName(),
    correctAnswer: this.gameName(),
    date: this.selectedDate(),
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
