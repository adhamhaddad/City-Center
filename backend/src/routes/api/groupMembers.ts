import { Router } from 'express';
import {
  validateCreateGroupMember,
  validateGetGroupMembers,
  validateGetGroupMember,
  validateUpdateGroupMember,
  validateDeleteGroupMember
} from '../../middleware/validation/groupMembers';
import {
  createGroupMember,
  getGroupMembers,
  getGroupMember,
  updateGroupMember,
  deleteGroupMember
} from '../../controllers/groupMembers';
import { expressFilterRequest, verifyToken } from '../../middleware';

const allowKeys = {
  post: ['group_id'],
  patch: ['user_id', 'user_role']
};

const router = Router();

router
  .post(
    '/',
    validateCreateGroupMember,
    verifyToken,
    expressFilterRequest(allowKeys),
    createGroupMember
  )
  .get('/:group_id', validateGetGroupMembers, verifyToken, getGroupMembers)
  .get('/:id', validateGetGroupMember, verifyToken, getGroupMember)
  .patch(
    '/:id',
    validateUpdateGroupMember,
    verifyToken,
    expressFilterRequest(allowKeys),
    updateGroupMember
  )
  .delete('/:id', validateDeleteGroupMember, verifyToken, deleteGroupMember);

export default router;
