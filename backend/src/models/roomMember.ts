import { PoolClient } from 'pg';
import { pgClient } from '../database';

type RoomMemberType = {
  id: number;
  room_id: number;
  user_id: string;
};
class RoomMember {
  async withConnection<T>(
    callback: (connection: PoolClient) => Promise<T>
  ): Promise<T> {
    const connection = await pgClient.connect();
    try {
      return await callback(connection);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
  async createRoomMember(rm: RoomMemberType): Promise<RoomMemberType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'INSERT INTO room_members (room_id, user_id) VALUES ($1, $2) RETURNING *',
        values: [rm.room_id, rm.user_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async getRoomMembers(room_id: number): Promise<RoomMemberType[]> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'SELECT * FROM room_members WHERE room_id=$1',
        values: [room_id]
      };
      const result = await connection.query(query);
      return result.rows;
    });
  }
  async deleteRoomMember(id: number, user_id: number): Promise<RoomMemberType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'DELETE FROM room_members WHERE id=$1 AND user_id=$2 RETURNING id',
        values: [id, user_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default RoomMember;
