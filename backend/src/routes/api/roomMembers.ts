import { Router } from 'express';
import {
  validateCreateRoomMember,
  validateGetRoomMembers,
  validateDeleteRoomMember
} from '../../middleware/validation/roomMembers';
import {
  createRoomMember,
  getRoomMembers,
  deleteRoomMember
} from '../../controllers/roomMembers';
import { expressFilterRequest, verifyToken } from '../../middleware';

const allowKeys = {
  post: ['room_id']
};

const router = Router();

router
  .post(
    '/',
    validateCreateRoomMember,
    verifyToken,
    expressFilterRequest(allowKeys),
    createRoomMember
  )
  .get('/:room_id', validateGetRoomMembers, verifyToken, getRoomMembers)
  .delete('/:id', validateDeleteRoomMember, verifyToken, deleteRoomMember);

export default router;
