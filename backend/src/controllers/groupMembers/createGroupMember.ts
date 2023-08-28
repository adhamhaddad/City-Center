import { Response } from 'express';
import { Request } from '../../middleware';
import GroupMember from '../../models/groupMember';

const groupMember = new GroupMember();

export const createGroupMember = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await groupMember.createGroupMember({
      ...req.body,
      user_id
    });
    res.status(201).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
