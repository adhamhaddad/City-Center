import { Router } from 'express';
import {
  validateCreateJob,
  validateGetJob,
  validateUpdateJob,
  validateDeleteJob
} from '../../middleware/validation/jobs';
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob
} from '../../controllers/jobs';
import { expressFilterRequest, verifyToken } from '../../middleware';
import { jobDocuments } from '../../utils/multer';

const allowKeys = {
  post: ['name', 'title', 'start_date', 'end_date'],
  patch: ['name', 'title', 'start_date', 'end_date']
};

const router = Router();

router
  .post(
    '/',
    validateCreateJob,
    verifyToken,
    expressFilterRequest(allowKeys),
    createJob
  )
  .get('/', verifyToken, getJobs)
  .get('/:id', validateGetJob, verifyToken, getJob)
  .patch(
    '/:id',
    validateUpdateJob,
    verifyToken,
    expressFilterRequest(allowKeys),
    updateJob
  )
  .delete('/:id', validateDeleteJob, verifyToken, deleteJob);

export default router;
