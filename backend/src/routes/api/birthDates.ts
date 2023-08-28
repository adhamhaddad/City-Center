import { Router } from 'express';
import {
  validateCreateBirthDate,
  validateGetBirthDate,
  validateUpdateBirthDate,
  validateDeleteBirthDate
} from '../../middleware/validation/birthDates';
import {
  createBirthDate,
  getBirthDate,
  updateBirthDate,
  deleteBirthDate
} from '../../controllers/birthDates';
import { expressFilterRequest, verifyToken } from '../../middleware';

const allowKeys = {
  post: ['birth_date'],
  patch: ['birth_date']
};

const router = Router();

router
  .post(
    '/',
    validateCreateBirthDate,
    verifyToken,
    expressFilterRequest(allowKeys),
    createBirthDate
  )
  .get('/:user_id', validateGetBirthDate, verifyToken, getBirthDate)
  .patch(
    '/:user_id',
    validateUpdateBirthDate,
    verifyToken,
    expressFilterRequest(allowKeys),
    updateBirthDate
  )
  .delete('/:user_id', validateUpdateBirthDate, verifyToken, deleteBirthDate);

export default router;
