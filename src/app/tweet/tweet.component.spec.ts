import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { TweetComponent } from './tweet.component';
import { TweetService } from './tweet.service';

describe('TweetComponent', () => {
  let testScheduler: TestScheduler;

  let tweetService: jasmine.SpyObj<TweetService>;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));

    tweetService = jasmine.createSpyObj('TweetService', [
      'getLikeCount', 'getRetweetCount', 'getReplyCount',
    ]);
  });

  describe('Unit Tests', () => {
    let component: TweetComponent;

    beforeEach(() => {
      component = new TweetComponent(tweetService);
    });

    describe('#ngOnInit()', () => {
      it('should retrieve like count', () => {
        tweetService.getLikeCount.and.returnValue(of(20));
        component.ngOnInit();

        component.likeCount$.subscribe((count: number) => {
          expect(count).toEqual(20);
        });
      });

      it('should emit expected reply count', () => {
        testScheduler.run(({ expectObservable }) => {
          component.ngOnInit();
          expectObservable(component.replyCount$).toBe('20ms a', {
            a: 40,
          });
        });
      });

      it('should emit expected retweet count', () => {
        testScheduler.run(({ expectObservable }) => {
          component.ngOnInit();
          expectObservable(component.retweetCount$).toBe('30ms a', {
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
