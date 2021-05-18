import { NEVER, Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { getMockedInstance } from '../../shared/spec-utils/get-mocked-instance';
import { TweetComponent } from './tweet.component';
import { TweetService } from './tweet.service';

describe('TweetComponent', () => {
  let testScheduler: TestScheduler;

  let tweetService: jest.Mocked<TweetService>;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));

    tweetService = getMockedInstance('./tweet.service', 'TweetService');
  });

  describe('Unit Tests', () => {
    let component: TweetComponent;

    beforeEach(() => {
      component = new TweetComponent(tweetService);
    });

    describe('#ngOnInit()', () => {
      it('should retrieve like count', () => {
        tweetService.getLikeCount.mockReturnValue(of(20));
        tweetService.getRetweetCount.mockReturnValue(NEVER);
        tweetService.getReplyCount.mockReturnValue(NEVER);
        component.ngOnInit();

        component.likeCount$.subscribe((count: number) => {
          expect(count).toEqual(20);
        });
      });

      it('should emit expected reply count', () => {
        testScheduler.run(({ cold, expectObservable, flush }) => {
          tweetService.getLikeCount.mockReturnValue(cold(''));
          tweetService.getReplyCount.mockReturnValue(cold('a', { a: 40 }));
          tweetService.getRetweetCount.mockReturnValue(cold(''));
          component.ngOnInit();
          flush();
          expectObservable(component.replyCount$).toBe('a', {
            a: 40,
          });
        });
      });

      it('should emit expected retweet count', () => {
        testScheduler.run(({ cold, expectObservable, flush }) => {
          tweetService.getLikeCount.mockReturnValue(cold(''));
          tweetService.getReplyCount.mockReturnValue(cold(''));
          tweetService.getRetweetCount.mockReturnValue(cold('a', { a: 50 }));
          component.ngOnInit();
          flush();
          expectObservable(component.retweetCount$).toBe('a', {
            a: 50,
          });
        });
      });
    });

    describe('#_renderCount()', () => {
      it('should emit placeholder and transform to string', () => {
        testScheduler.run(({ cold, expectObservable }) => {
          const obs$: Observable<number> = cold('10ms a', { a: 88 });
          expectObservable(obs$.pipe(component.renderCount())).toBe('a 9ms b', { a: '...', b: '88' });
        });
      });

      it('should emit error placeholder', () => {
        testScheduler.run(({ cold, expectObservable }) => {
          const obs$: Observable<number> = cold('10ms #');
          expectObservable(obs$.pipe(component.renderCount())).toBe('a 9ms (b|)', { a: '...', b: '???' });
        });
      });
    });
  });

  describe('Template Tests', () => {

  });
});
