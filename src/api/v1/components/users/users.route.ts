// noinspection JSCheckFunctionSignatures

import userController from "./users.controller";
import router from '../../../config/router.config';

router.get('/users/all', userController.users);

export {router};
