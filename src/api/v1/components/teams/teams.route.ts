// noinspection JSCheckFunctionSignatures

import teamsValidator from "./teams.validator";
import teamsController from "./teams.controller";
const {RATE_WINDOW_TIME, RATE_HITS } = process.env;
import router from '../../../config/router.config';
import { rateLimiter } from "../../../middlewares";
import {authorize} from "../../../middlewares/auth";
import { validate } from "../../../../utils/helpers";

router.get('/search', teamsController.searchTeam);
router.get('/:teamId', authorize({roles: 'admin'}), teamsController.get);
router.get('/', authorize({roles: ['admin', 'user']}), rateLimiter({secondsWindow: Number(RATE_WINDOW_TIME), allowedHits: Number(RATE_HITS), prefix: 'team'}), teamsController.getAll);
router.delete('/:teamId', authorize({roles: 'admin'}), teamsController.deleteTeam);
router.put('/:teamId', authorize({roles: 'admin'}), validate(teamsValidator.update), teamsController.updateTeam);
router.post('/create', authorize({roles: 'admin'}), validate(teamsValidator.create), teamsController.createTeam);

// Load team when API with teamId route parameter is hit on the :teamnId params
router.param('teamId', teamsController.loadTeam);

export {router};

