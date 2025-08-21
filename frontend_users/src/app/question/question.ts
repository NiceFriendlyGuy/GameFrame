import { HttpHeaders, httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cover, IGDB, IGDBGameList, Screenshots } from '../common/models/IGDB';
import { PollListResponse, Poll as PollModel } from '../common/models/poll';
import { Auth } from '../auth';
import { QuestionService } from '../question.service';

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
  readonly selectedGameCoverFromSearch = signal<Cover | null>(null);

  readonly user;

  readonly guesses = computed(() => {
    return this.userQuestionState()?.guesses ?? [];
  });

  readonly userQuestionState = computed(() => {
    const allAnswered = this.answeredQuestionsResource.value();
    const currentId = this.id();

    if (!allAnswered || !currentId) return [];

    const entry = allAnswered.find(p => p.pollId === currentId);
    return entry;
  });



  public polls: PollModel[] = [];

  public screenshots: Screenshots[] = [];
  public currentGuessScreenshot: string | null = null;


  readonly isFullyLoaded = computed(() =>
    !!this.pollRessource.value() && !!this.IGDBRessource.value() && !!this.userQuestionState
  );

  readonly searchQuery = signal<string>("");
  searchResults: any[] = [];
  public isSearchBoxOpen: boolean = false;


  public selectedImage: string | null = null;

  constructor(private router: Router, private auth:Auth, private questionService: QuestionService,) {

    this.user = this.auth.getUserEmail();

    effect(() => {
      const poll = this.pollRessource.value();
      if (!poll) return;
      this.gameName.set(poll.name);
      this.screenshots = (this.IGDBRessource?.value()?.screenshots || []).slice(0, 5);
      const idx = Math.min(this.guesses().length, Math.max(this.screenshots.length - 1, 0));
      this.currentGuessScreenshot = this.screenshots[idx]?.url ?? null;

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

  readonly gameSearchResource = httpResource<IGDBGameList>(() => {
    const query = this.searchQuery().trim();
    return query.length > 2
      ? `https://api.gameframe.ch/api/search/${encodeURIComponent(query)}`
      : undefined; 
  });

  readonly answeredQuestionsResource = httpResource<any[]>(() => {
    const email = this.auth.getUserEmail()?.email;
    return email
      ? {
          url: `https://api.gameframe.ch/api/users/answeredPolls`,
          headers: new HttpHeaders({ 'x-user-email': email })
        }
      : undefined;
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
    this.selectedGameFromSearch.set(game);
    this.selectedGameCoverFromSearch.set(game.image);
    this.gameName.set(game.name);
    this.isSearchBoxOpen = false;
  }

  confirmSelectedAnswerFromSearch(selectedGame?: string) {
  if (!selectedGame) return;
  this.selectAnswer(selectedGame);
  this.selectedGameFromSearch.set(null);
  this.searchQuery.set('');
}


  selectAnswer(answer: string) {
  const id = this.id();
  if (!id) return;


  this.questionService.addGuess(id, answer).subscribe({
    next: () => {
      this.answeredQuestionsResource.reload();

      const correct = this.pollRessource.value()?.correctAnswer;
      if (correct && answer === correct || this.guesses().length >= 4) {
        this.questionService.markPollAsAnswered(id).subscribe({
          next: () => this.answeredQuestionsResource.reload(),
          error: e => console.error('mark answered failed', e)
        });
      }
    },
    error: e => console.error('add guess failed', e)
  });
}


}
