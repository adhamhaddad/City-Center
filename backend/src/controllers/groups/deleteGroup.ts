import { Response } from 'express';
import { Request } from '../../middleware';
import Group from '../../models/group';

const group = new Group();

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await group.deleteGroup(parseInt(req.params.id), user_id);
    res.setHeader('Content-Location', `/groups/${response.id}`);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
