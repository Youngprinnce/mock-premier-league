// noinspection JSCheckFunctionSignatures

import authValidator from "./auth.validator";
import authController from "./auth.controller";
import router from '../../../config/router.config';
import { validate } from "../../../../utils/helpers";

router.post("/login", validate(authValidator.login), authController.login);
router.post("/signup",validate(authValidator.userSignup),authController.signup);

export {router};
