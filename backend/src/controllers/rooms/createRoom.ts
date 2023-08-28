import { Response } from 'express';
import { Request } from '../../middleware';
import { io } from '../../server';
import Room from '../../models/room';

const room = new Room();

export const createRoom = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await room.createRoom({ ...req.body, user_id });
    io.emit('rooms', { action: 'CREATE', data: response });
    res.status(201).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
