import { fakeAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { SessionService } from './session.service';
import { ReservedClaims } from './typings/reserved-claims';
import { Session } from './typings/session';
import { SessionStatus } from './typings/session-status';

describe('SessionService', () => {
  let testScheduler: TestScheduler;
  let service: SessionService;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
    service = new SessionService();
  });

  describe('#session', () => {
    it('should not emit when session does not exist', () => {
      testScheduler.run(({ expectObservable }) => {
        expectObservable(service.session).toBe('');
      });
    });

    it('should emit session set when session exists', () => {
      const session: Session = fakeSession();
      service.setSession(session);

      testScheduler.run(({ expectObservable }) => {
        expectObservable(service.session).toBe('a', {
          a: session,
        });
      });
    });

    it('should not emit new value after dismissal', () => {
      const session: Session = fakeSession();
      service.setSession(session);
      service.dismissSession();

      testScheduler.run(({ expectObservable }) => {
        expectObservable(service.session).toBe('');
      });
    });
  });

  describe('#sessionStatus', () => {
    it('should be None when session does not exist', () => {
      testScheduler.run(({ expectObservable }) => {
        expectObservable(service.sessionStatus).toBe('a', { a: SessionStatus.None });
      });
    });

    it('should be Valid when session does exist and is not expired', () => {
      const session: Session = fakeSession({ iat: Date.now(), exp: Date.now() + 1000 });
      service.setSession(session);

      testScheduler.run(({ expectObservable }) => {
        expectObservable(service.sessionStatus).toBe('a', { a: SessionStatus.Valid });
      });
    });

    it('should be Expired when session does exist and is expired', () => {
      const session: Session = fakeSession({ iat: Date.now(), exp: Date.now() - 1000 });
      service.setSession(session);

      testScheduler.run(({ expectObservable }) => {
        expectObservable(service.sessionStatus).toBe('a', { a: SessionStatus.Expired });
      });
    });
  });

  describe('#secondsToExpiration', () => {
    it('should not emit when session does not exist', () => {
      testScheduler.run(({ expectObservable }) => {
        expectObservable(service.secondsToExpiration).toBe('');
      });
    });

    it('should emit seconds as time passes', fakeAsync(() => {
      const session: Session = fakeSession({ exp: Date.now() + 3 * 1000 });
      service.setSession(session);

      testScheduler.run(({ expectObservable }) => {
        expectObservable(service.secondsToExpiration).toBe('a 999ms b 999ms c 999ms d', {
          a: 3,
          b: 2,
          c: 1,
          d: 0,
        });
      });
    }));

    it('should cancel emitting seconds when session is dismissed', fakeAsync(() => {
      const session: Session = fakeSession({ exp: Date.now() + 60 * 1000 });
      service.setSession(session);

      testScheduler.run(({ hot, expectObservable }) => {
        hot('3000ms a').subscribe(() => {
          service.dismissSession();
        });
        expectObservable(service.secondsToExpiration).toBe('a 999ms b 999ms c', {
          a: 60,
          b: 59,
          c: 58,
        });
      });
    }));
  });
});

function fakeSession(claims: Partial<ReservedClaims> = {}): Session {
  return {
    user: {
      id: '123',
      email: 'me@heb.com',
    },
    claims: {
      iat: claims.iat ?? Date.now(),
      exp: claims.exp ?? Date.now() + 60 * 1000,
    },
  };
}
