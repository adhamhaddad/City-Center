import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validate } from '../validationResult';

export const validateCreateJob = [
  body('name')
    .exists()
    .withMessage('Job name is missing from the body.')
    .notEmpty()
    .withMessage('Job name is empty')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Job name must be at least 2 and maximum 50 letters'),
  body('title')
    .exists()
    .withMessage('Title is missing from the body.')
    .notEmpty()
    .withMessage('Title is empty')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Title must be at least 2 and maximum 50 letters'),
  body('start_date')
    .exists()
    .withMessage('Start date is missing from the body.')
    .isISO8601()
    .withMessage('Start date must be in ISO 8601 format (YYYY-MM-DD)'),
  body('end_date')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('End date must be in ISO 8601 format (YYYY-MM-DD)'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
