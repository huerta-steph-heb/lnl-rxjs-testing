import { Component, Input, OnInit } from '@angular/core';
import { from, MonoTypeOperatorFunction, Observable, of, OperatorFunction, pipe, UnaryFunction } from 'rxjs';
import { catchError, map, share, startWith, switchAll, switchMap, tap } from 'rxjs/operators';
import { TweetService } from './tweet.service';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss'],
})
export class TweetComponent implements OnInit {
  @Input()
  public displayName!: string;

  @Input()
  public username!: string;

  @Input()
  public text!: string;

  @Input()
  public imageUrl?: string;

  public likeCount$!: Observable<number>;
  public retweetCount$!: Observable<number>;
  public replyCount$!: Observable<number>;

  public _template!: {
    likeCount$: Observable<string>;
    retweetCount$: Observable<string>;
    replyCount$: Observable<string>;
  };

  public constructor(
    private tweetService: TweetService,
  ) {}

  public ngOnInit(): void {
    this.likeCount$ = this.tweetService.getLikeCount();
    this.replyCount$ = this.tweetService.getReplyCount();
    this.retweetCount$ = this.tweetService.getRetweetCount();

    this._template = {
      likeCount$: this.likeCount$.pipe(this.renderCount()),
      replyCount$: this.replyCount$.pipe(this.renderCount()),
      retweetCount$: this.retweetCount$.pipe(this.renderCount()),
    };
  }

  public renderCount(): UnaryFunction<Observable<number>, Observable<string>> {
    return pipe(
      map((count: number) => `${count}`),
      catchError(() => of('???')),
      startWith('...'),
    );
  }
}
