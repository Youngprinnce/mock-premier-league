export {};
import { ITeam } from '../../src/api/v1/components/teams/teams.model';
import { IUser } from '../../src/api/v1/components/users/users.model';
import { IFixture } from '../../src/api/v1/components/fixtures/fixtures.model';

declare global {
    namespace Express {
        interface Request {
            authUser: IUser
            team: ITeam
            fixture: IFixture
        }
    }
}