import { Request, Response, NextFunction } from 'express';
import { check, body } from 'express-validator';
import { validate } from '../validationResult';

export const validateUpdateUserCity = [
  check('id')
    .exists()
    .withMessage('id is missing from the parameters')
    .notEmpty()
    .withMessage('id is empty'),
  body('city')
    .exists()
    .withMessage('City is missing from the body.')
    .notEmpty()
    .withMessage('City is empty')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be at least 2 and maximum 50 letters'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
