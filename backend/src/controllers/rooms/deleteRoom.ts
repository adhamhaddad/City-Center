import { Response } from 'express';
import { Request } from '../../middleware';
import { io } from '../../server';
import Room from '../../models/room';

const room = new Room();

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await room.deleteRoom(parseInt(req.params.id), user_id);
    io.emit('rooms', { action: 'DELETE', data: response });
    res.setHeader('Content-Location', `/rooms/${response.id}`);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
