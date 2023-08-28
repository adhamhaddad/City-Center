import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validate } from '../validationResult';

export const validateUpdateBirthDate = [
  body('birth_date')
    .exists()
    .withMessage('Birth Date is missing from the body.')
    .notEmpty()
    .withMessage('Birth Date is empty')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Birth Date must be at least 2 and maximum 50 letters'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
