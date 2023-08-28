import { Request, Response, NextFunction } from 'express';
import { check, body } from 'express-validator';
import { validate } from '../validationResult';

export const validateUpdateCollege = [
  check('id')
    .exists()
    .withMessage('id is missing from the parameters')
    .notEmpty()
    .withMessage('id is empty'),
  body('name')
    .exists()
    .withMessage('College name is missing from the body.')
    .notEmpty()
    .withMessage('College name is empty')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('College name must be at least 2 and maximum 50 letters'),
  body('major')
    .exists()
    .withMessage('Major is missing from the body.')
    .notEmpty()
    .withMessage('Major is empty')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Major must be at least 2 and maximum 50 letters'),
  body('level')
    .exists()
    .withMessage('Level is missing from the body.')
    .notEmpty()
    .withMessage('Level is empty')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Level must be at least 2 and maximum 50 letters'),
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
