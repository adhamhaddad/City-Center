import { PoolClient } from 'pg';
import { pgClient } from '../database';

export type RoomType = {
  id: number;
  created_by: number;
  title: string;
  keywords: string;
  conversation_participant_id: number;
  created_at?: Date;
};
class Room {
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
  async createRoom(r: RoomType): Promise<RoomType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'INSERT INTO rooms (created_by, title, keywords) VALUES ($1, $2, $3) RETURNING *',
        values: [r.created_by, r.title, r.keywords]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async getRooms(): Promise<RoomType[]> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'SELECT * FROM rooms'
      };
      const result = await connection.query(query);
      return result.rows;
    });
  }
  async getRoom(id: number): Promise<RoomType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'SELECT * FROM rooms WHERE id=$1',
        values: [id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async updateRoom(id: number, g: RoomType): Promise<RoomType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'UPDATE rooms SET title=$3, keywords=$4 WHERE id=$1 AND created_by=$2 RETURNING *',
        values: [id, g.created_by, g.title, g.keywords]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async deleteRoom(id: number, user_id: number): Promise<RoomType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'DELETE FROM rooms WHERE id=$1 AND created_by=$2 RETURNING id',
        values: [id, user_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default Room;
