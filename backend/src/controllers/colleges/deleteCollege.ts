import { Response } from 'express';
import { Request } from '../../middleware';
import College from '../../models/college';

const college = new College();

export const deleteCollege = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await college.deleteCollege(
      parseInt(req.params.id),
      user_id
    );
    res.setHeader('Content-Location', `/colleges/${response.id}`);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
