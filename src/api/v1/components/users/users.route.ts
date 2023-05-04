// noinspection JSCheckFunctionSignatures

import userController from "./users.controller";
import router from '../../../config/router.config';

router.get('/', userController.users);

export {router};
