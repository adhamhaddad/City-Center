import { Response } from 'express';
import { Request } from '../../middleware';
import Job from '../../models/job';

const job = new Job();

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await job.deleteJob(parseInt(req.params.id), user_id);
    res.setHeader('Content-Location', `/jobs/${response.id}`);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
