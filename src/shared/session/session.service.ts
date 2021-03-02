import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, interval, NEVER, Observable } from 'rxjs';
import { concatMap, map, scan, startWith, switchMap, takeWhile } from 'rxjs/operators';
import { filterNullish } from '../stream-operators/filter-nullish';
import { Session } from './typings/session';
import { SessionStatus } from './typings/session-status';

@Injectable()
export class SessionService {
  private sessionInternal: BehaviorSubject<Session | null>;

  public get session(): Observable<Session> {
    return this.sessionInternal.pipe(
      filterNullish(),
    );
  }

  public get sessionStatus(): Observable<SessionStatus> {
    return this.sessionInternal.pipe(
      map((session: Session | null) => {
        if (session === null) {
          return SessionStatus.None;
        }
        return session.claims.exp > Date.now()
          ? SessionStatus.Valid
          : SessionStatus.Expired;
      }),
    );
  }

  public get secondsToExpiration(): Observable<number> {
    const pollMilliseconds = 1000;

    return this.sessionInternal.pipe(
      switchMap((sessionInternal: Session | null) =>
        iif(
          () => sessionInternal === null,
          NEVER,
          this.session.pipe(
            map((session: Session) => session.claims.exp - Date.now()),
            concatMap((initialMilliseconds: number) => {
              return interval(pollMilliseconds).pipe(
                scan((remainingMilliseconds: number) => remainingMilliseconds - pollMilliseconds, initialMilliseconds),
                map((remainingMilliseconds: number) => Math.floor(remainingMilliseconds / 1000)),
                startWith(Math.floor(initialMilliseconds / 1000)),
                takeWhile((remainingSeconds: number) => remainingSeconds >= 0),
              );
            }),
          ),
        ),
      ),
    );
  }

  public constructor() {
    this.sessionInternal = new BehaviorSubject<Session | null>(null);
  }

  public dismissSession(): void {
    this.sessionInternal.next(null);
  }

  public setSession(session: Session): void {
    this.sessionInternal.next(session);
  }
}
