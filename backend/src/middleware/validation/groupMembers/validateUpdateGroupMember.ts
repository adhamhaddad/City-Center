import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validate } from '../validationResult';

const validRoles = ['ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'MEMBER'];

export const validateUpdateGroupMember = [
  body('user_id')
    .exists()
    .withMessage('user_id is missing from the body')
    .notEmpty()
    .withMessage('user_id is empty')
    .isNumeric()
    .withMessage('user_id must be a number'),
  body('user_role')
    .exists()
    .withMessage('User role is missing from the body')
    .notEmpty()
    .withMessage('User role is empty')
    .isString()
    .withMessage('User role must be a string')
    .isIn(validRoles)
    .withMessage(`Invalid role. Valid roles are: ${validRoles.join(', ')}`),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
