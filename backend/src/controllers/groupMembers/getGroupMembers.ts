import { Response } from 'express';
import { Request } from '../../middleware';
import GroupMember from '../../models/groupMember';

const groupMember = new GroupMember();

export const getGroupMembers = async (req: Request, res: Response) => {
  try {
    const response = await groupMember.getGroupMembers(
      parseInt(req.params.group_id)
    );
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
