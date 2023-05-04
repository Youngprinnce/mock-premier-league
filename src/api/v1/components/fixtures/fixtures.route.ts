// noinspection JSCheckFunctionSignatures

const {RATE_WINDOW_TIME, RATE_HITS } = process.env;
import router from '../../../config/router.config';
import { rateLimiter } from '../../../middlewares';
import {authorize} from "../../../middlewares/auth";
import { validate } from "../../../../utils/helpers";
import fixturesValidator from "./fixtures.validator";
import fixturesController from "./fixtures.controller";
import teamsController from '../teams/teams.controller';

router.get('/fixtures/search', fixturesController.search);
router.get('/fixtures/view', authorize({roles: ['admin', 'user']}), rateLimiter({secondsWindow: Number(RATE_WINDOW_TIME), allowedHits: Number(RATE_HITS), prefix: 'fixture'}), fixturesController.getAll);
router.post('/fixture/create', validate(fixturesValidator.create), authorize({roles: 'admin'}), fixturesController.create);
router.get('/fixtures/:fixtureId', authorize({roles: 'admin'}), fixturesController.get)
router.put('/fixtures/:fixtureId', validate(fixturesValidator.update), authorize({roles: 'admin'}), fixturesController.update)
router.put('/:fixtureId/update-score/:teamId', validate(fixturesValidator.score), authorize({roles: 'admin'}), fixturesController.updateScore);
router.get('/link/:uniqueLink', authorize({roles: 'admin'}), fixturesController.fetchFixture);
router.delete('/fixtures/:fixtureId', authorize({roles: 'admin'}), fixturesController.delete);

//Load team/fixture when API with teamId/fixtureId route parameter is hit on the :teamId / :fixtureId params
router.param('fixtureId', fixturesController.loadFixture);
router.param('teamId', teamsController.loadTeam);

export {router};

