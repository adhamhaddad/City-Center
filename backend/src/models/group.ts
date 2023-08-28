import { PoolClient } from 'pg';
import { pgClient } from '../database';

export type GroupType = {
  id: number;
  created_by: number;
  title: string;
  keywords: string;
  created_at?: Date;
  updated_at?: Date;
};
class Group {
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
  async createGroup(g: GroupType): Promise<GroupType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'INSERT INTO groups (created_by, title, keywords) VALUES ($1, $2, $3) RETURNING *',
        values: [g.created_by, g.title, g.keywords]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async getGroups(user_id: number): Promise<GroupType[]> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'SELECT * FROM groups WHERE created_by=$1',
        values: [user_id]
      };
      const result = await connection.query(query);
      return result.rows;
    });
  }
  async getGroup(id: number): Promise<GroupType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'SELECT * FROM groups WHERE id=$1',
        values: [id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async updateGroup(id: number, g: GroupType): Promise<GroupType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'UPDATE groups SET title=$3, keywords=$4 WHERE id=$1 AND created_by=$2 RETURNING *',
        values: [id, g.created_by, g.title, g.keywords]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async deleteGroup(id: number, user_id: number): Promise<GroupType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'DELETE FROM groups WHERE id=$1 AND created_by=$2 RETURNING id',
        values: [id, user_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default Group;
