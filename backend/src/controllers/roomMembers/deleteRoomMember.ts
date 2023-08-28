import { Response } from 'express';
import { Request } from '../../middleware';
import { io } from '../../server';
import RoomMember from '../../models/roomMember';

const roomMember = new RoomMember();

export const deleteRoomMember = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await roomMember.deleteRoomMember(
      parseInt(req.params.id),
      user_id
    );
    io.emit('room-members', { action: 'DELETE', data: response });
    res.setHeader('Content-Location', `/room-members/${response.id}`);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
