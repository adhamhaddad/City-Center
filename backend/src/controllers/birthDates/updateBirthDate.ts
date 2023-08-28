import { Response } from 'express';
import { Request } from '../../middleware';
import BirthDate from '../../models/birthDate';

const birthDate = new BirthDate();

export const updateBirthDate = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await birthDate.updateBirthDate(user_id, req.body);
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
