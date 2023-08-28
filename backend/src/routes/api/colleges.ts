import { Router } from 'express';
import {
  validateCreateCollege,
  validateGetCollege,
  validateUpdateCollege,
  validateDeleteCollege
} from '../../middleware/validation/colleges';
import {
  createCollege,
  getColleges,
  getCollege,
  updateCollege,
  deleteCollege
} from '../../controllers/colleges';
import { expressFilterRequest, verifyToken } from '../../middleware';
import { cardImages } from '../../utils/multer';

const allowKeys = {
  post: ['name', 'major', 'level', 'start_date', 'end_date'],
  patch: ['name', 'major', 'level', 'start_date', 'end_date']
};

const router = Router();

router
  .post(
    '/',
    validateCreateCollege,
    verifyToken,
    expressFilterRequest(allowKeys),
    createCollege
  )
  .get('/', verifyToken, getColleges)
  .get('/:id', validateGetCollege, verifyToken, getCollege)
  .patch(
    '/:id',
    validateUpdateCollege,
    verifyToken,
    expressFilterRequest(allowKeys),
    updateCollege
  )
  .delete('/:id', validateDeleteCollege, verifyToken, deleteCollege);

export default router;
