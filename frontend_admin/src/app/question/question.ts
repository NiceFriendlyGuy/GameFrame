import { Component, computed, effect, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PollListResponse, Poll as PollModel } from '../common/models/poll';
import { IGDB, Screenshots } from '../common/models/IGDB';


@Component({
  selector: 'app-question',
  imports: [],
  templateUrl: './question.html',
  styleUrl: './question.css'
})
export class Question {

  private route = inject(ActivatedRoute);

  readonly gameName = signal<string>('');
  readonly id = signal(null);
  readonly previousPoll = signal<PollModel | null>(null);
  readonly nextPoll = signal<PollModel | null>(null);

  public polls: PollModel[] = [];

  public screenshots: Screenshots[] = [];
  public currentGuessScreenshot: string | null = null;

  public isLoading: boolean = false;

  public selectedImage: string | null = null;

  constructor(private router: Router) {
    this.isLoading = true;

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


    effect(() => {
      this.isLoading = !this.isFullyLoaded();
    });
  }

  readonly pollListRessource = httpResource<PollListResponse>(() =>
    `https://api.gameframe.ch/api/entries`
  );

  readonly pollRessource = httpResource<PollModel>(() =>
    `https://api.gameframe.ch/api/entries/${this.id()}`
  );

  readonly IGDBRessource = httpResource<IGDB>(() => {
    const poll = this.pollRessource.value();
    return poll?.name ? `https://api.gameframe.ch/api/games/${poll.name}` : undefined;
  });

  readonly isFullyLoaded = computed(() =>
    !!this.pollRessource.value() && !!this.IGDBRessource.value()
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

}
