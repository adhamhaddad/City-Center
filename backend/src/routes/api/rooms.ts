import { Router } from 'express';
import {
  validateCreateRoom,
  validateGetRooms,
  validateGetRoom,
  validateDeleteRoom
} from '../../middleware/validation/rooms';
import {
  createRoom,
  getRooms,
  getRoom,
  deleteRoom
} from '../../controllers/rooms';
import { expressFilterRequest, verifyToken } from '../../middleware';

const allowKeys = {
  post: ['title', 'keywords']
};

const router = Router();

router
  .post(
    '/',
    validateCreateRoom,
    verifyToken,
    expressFilterRequest(allowKeys),
    createRoom
  )
  .get('/', verifyToken, getRooms)
  .get('/:id', validateGetRoom, verifyToken, getRoom)
  .delete('/:id', validateDeleteRoom, verifyToken, deleteRoom);

export default router;
