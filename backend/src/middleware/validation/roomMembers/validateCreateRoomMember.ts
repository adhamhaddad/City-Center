import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validate } from '../validationResult';

export const validateCreateRoomMember = [
  body('room_id')
    .exists()
    .withMessage('room_id is missing from the body')
    .notEmpty()
    .withMessage('room_id is empty')
    .isNumeric()
    .withMessage('room_id must be a number'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
