import { Response } from 'express';
import { Request } from '../../middleware';
import { io } from '../../server';
import RoomMember from '../../models/roomMember';

const roomMember = new RoomMember();

export const createRoomMember = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await roomMember.createRoomMember({
      ...req.body,
      user_id
    });
    io.emit('room-members', { action: 'CREATE', data: response });
    res.status(201).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
