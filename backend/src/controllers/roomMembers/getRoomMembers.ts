import { Response } from 'express';
import { Request } from '../../middleware';
import RoomMember from '../../models/roomMember';

const roomMember = new RoomMember();

export const getRoomMembers = async (req: Request, res: Response) => {
  try {
    const response = await roomMember.getRoomMembers(
      parseInt(req.params.room_id)
    );
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
