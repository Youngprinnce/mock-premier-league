import { check } from "express-validator";

const userSignup = [
  check('firstName').trim().isLength({min: 1}).withMessage('firstName cannot be empty.'),
  check('lastName').trim().isLength({min: 1}).withMessage('lastName cannot be empty.'),
  check('password').matches(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
    .withMessage('Password must contain 8 characters and at least 1 number, 1 uppercase, and 1 lowercase letter.'),
  check('email').not().isEmpty().withMessage('email is required.').normalizeEmail(
  {
    all_lowercase: true, gmail_lowercase: true,
    yahoo_remove_subaddress: false, icloud_lowercase: true, icloud_remove_subaddress: false,
    outlookdotcom_lowercase: true, outlookdotcom_remove_subaddress: false, yahoo_lowercase: true,
    gmail_remove_dots: false, gmail_remove_subaddress: false, gmail_convert_googlemaildotcom: false,
  }
).isEmail().withMessage('Must be valid email.').matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i).withMessage('Must be valid email.'),
];

const login = [
  check('password').not().isEmpty().withMessage('Password cannot be empty'),
  check('email', 'Email is required.').normalizeEmail(
  {
    all_lowercase: true, gmail_lowercase: true,
    yahoo_remove_subaddress: false, icloud_lowercase: true, icloud_remove_subaddress: false,
    outlookdotcom_lowercase: true, outlookdotcom_remove_subaddress: false, yahoo_lowercase: true,
    gmail_remove_dots: false, gmail_remove_subaddress: false, gmail_convert_googlemaildotcom: false,
  }
).isEmail().withMessage('Must be valid email.').matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i).withMessage('Must be valid email.'),
];

export = {userSignup, login}
