import { ReservedClaims } from './reserved-claims';
import { SessionUser } from './session-user';

export interface Session {
  readonly user: SessionUser;
  readonly claims: ReservedClaims;
}
