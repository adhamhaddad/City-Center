import { Response } from 'express';
import { Request } from '../../middleware';
import Room from '../../models/room';

const room = new Room();

export const getRooms = async (req: Request, res: Response) => {
  try {
    const response = await room.getRooms();
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
