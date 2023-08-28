import { Request, Response, NextFunction } from 'express';
import { check, body } from 'express-validator';
import { validate } from '../validationResult';

export const validateUpdateGroup = [
  check('id')
    .exists()
    .withMessage('id is missing from the parameters')
    .notEmpty()
    .withMessage('id is empty'),
  body('title')
    .exists()
    .withMessage('Title name is missing from the body.')
    .notEmpty()
    .withMessage('Title name is empty')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Title name must be at least 2 and maximum 50 letters'),
  body('keywords')
    .exists()
    .withMessage('Keywords is missing from the body.')
    .notEmpty()
    .withMessage('Keywords is empty')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Keywords must be at least 2 and maximum 50 letters'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
