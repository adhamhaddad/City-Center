import { Request, Response, NextFunction } from 'express';
import { check } from 'express-validator';
import { validate } from '../validationResult';

export const validateGetRoomMembers = [
  check('room_id')
    .exists()
    .withMessage('room_id is missing from the parameters')
    .notEmpty()
    .withMessage('room_id is empty'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
