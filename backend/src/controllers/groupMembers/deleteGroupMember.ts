import { Response } from 'express';
import { Request } from '../../middleware';
import GroupMember from '../../models/groupMember';

const groupMember = new GroupMember();

export const deleteGroupMember = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await groupMember.deleteGroupMember(
      parseInt(req.params.id),
      user_id
    );
    res.setHeader('Content-Location', `/group-members/${response.id}`);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
