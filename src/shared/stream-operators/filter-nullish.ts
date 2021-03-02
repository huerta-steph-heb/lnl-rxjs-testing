import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export const filterNullish = <T>() => {
  return (source: Observable<T | null | undefined>): Observable<T> => {
    return source.pipe(
      filter((input: T | null | undefined) => input !== null && input !== undefined),
    ) as Observable<T>;
  };
};
