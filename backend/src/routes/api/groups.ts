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
  post: ['title', 'keywords'],
  patch: ['title', 'keywords']
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
  .get('/', validateGetGroupMembers, verifyToken, getGroupMembers)
  .get('/', validateGetGroupMember, verifyToken, getGroupMember)
  .patch(
    '/:id',
    validateUpdateGroupMember,
    verifyToken,
    expressFilterRequest(allowKeys),
    updateGroupMember
  )
  .delete('/', validateDeleteGroupMember, verifyToken, deleteGroupMember);

export default router;
