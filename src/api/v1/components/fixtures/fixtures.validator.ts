import {isValidObjectId} from "mongoose"
import { check, body } from "express-validator";

const create = [
  check('homeTeam').notEmpty().withMessage('Home team is required').custom(homeTeam => {if(!isValidObjectId(homeTeam)){throw new Error(`homeTeam' is an invalid ObjectId`)} return homeTeam}),
  body('awayTeam').notEmpty().withMessage('Away team is required').custom(awayTeam => {if(!isValidObjectId(awayTeam)){throw new Error(`awayTeam' is an invalid ObjectId`)} return awayTeam}),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be in ISO8601 format'),
  body('venue').notEmpty().withMessage('Venue is required').isString().withMessage('Venue must be a string'),
];

const update = [
  check('homeTeam').optional().notEmpty().withMessage('Home team is required').custom(homeTeam => {if(!isValidObjectId(homeTeam)){throw new Error(`homeTeam' is an invalid ObjectId`)} return homeTeam}),
  body('awayTeam').optional().notEmpty().withMessage('Away team is required').custom(awayTeam => {if(!isValidObjectId(awayTeam)){throw new Error(`awayTeam' is an invalid ObjectId`)} return awayTeam}),
  body('date').optional().notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be in ISO8601 format'),
  body('venue').optional().notEmpty().withMessage('Venue is required').isString().withMessage('Venue must be a string'),
];

const score = [
  check('score').notEmpty().withMessage('score is required').isInt().withMessage('score must be an integer'),
];

export = {create, update, score}