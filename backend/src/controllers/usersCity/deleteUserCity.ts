import { Response } from 'express';
import { Request } from '../../middleware';
import UserCity from '../../models/usersCity';

const userCity = new UserCity();

export const deleteUserCity = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await userCity.deleteUserCity(user_id);
    res.setHeader('Content-Location', `/users/${response.id}`);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
