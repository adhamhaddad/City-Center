import { Response } from 'express';
import { Request } from '../../middleware';
import College from '../../models/college';

const college = new College();
export const getCollege = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await college.getCollege(parseInt(req.params.id), user_id);
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};