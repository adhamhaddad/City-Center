import { Router } from 'express';
import {
  validateCreateUserCity,
  validateGetUserCity,
  validateUpdateUserCity,
  validateDeleteUserCity
} from '../../middleware/validation/usersCity';
import {
  createUserCity,
  getUserCity,
  updateUserCity,
  deleteUserCity
} from '../../controllers/usersCity';
import { expressFilterRequest, verifyToken } from '../../middleware';

const allowKeys = {
  post: ['city'],
  patch: ['city']
};

const router = Router();

router
  .post(
    '/',
    validateCreateUserCity,
    verifyToken,
    expressFilterRequest(allowKeys),
    createUserCity
  )
  .get('/:user_id', validateGetUserCity, verifyToken, getUserCity)
  .patch(
    '/:user_id',
    validateUpdateUserCity,
    verifyToken,
    expressFilterRequest(allowKeys),
    updateUserCity
  )
  .delete('/:user_id', validateDeleteUserCity, verifyToken, deleteUserCity);

export default router;
