import { Response } from 'express';
import { Request } from '../../middleware';
import UserCity from '../../models/usersCity';

const userCity = new UserCity();

export const updateUserCity = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await userCity.updateUserCity(user_id, req.body);
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
