import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TweetService {
  public getLikeCount(): Observable<number> {
    return timer(1000).pipe(
      map(() => 30),
    );
  }

  public getRetweetCount(): Observable<number> {
    return timer(2000).pipe(
      map(() => 40),
    );
  }

  public getReplyCount(): Observable<number> {
    return timer(3000).pipe(
      map(() => 50),
    );
  }
}
