import { PoolClient } from 'pg';
import { pgClient } from '../database';

enum UserRole {
  'ADMIN' = 'ADMIN',
  'SUPER_ADMIN' = 'SUPER_ADMIN',
  'MODERATOR' = 'MODERATOR',
  'MEMBER' = 'MEMBER'
}
type GroupMemberType = {
  id: number;
  group_id: number;
  user_id: string;
  user_role: UserRole;
  created_at?: Date;
};
class GroupMember {
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
  async createGroupMember(gm: GroupMemberType): Promise<GroupMemberType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'INSERT INTO group_members (group_id, user_id, user_role) VALUES ($1, $2, $3) RETURNING *',
        values: [gm.group_id, gm.user_id, gm.user_role]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async getGroupMembers(group_id: number): Promise<GroupMemberType[]> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'SELECT * FROM group_members WHERE group_id=$1',
        values: [group_id]
      };
      const result = await connection.query(query);
      return result.rows;
    });
  }
  async getGroupMember(id: number): Promise<GroupMemberType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'SELECT * FROM group_members WHERE id=$1',
        values: [id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async updateGroupMember(
    id: number,
    g: GroupMemberType
  ): Promise<GroupMemberType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'UPDATE group_members SET user_role=$3 WHERE id=$1 AND user_id=$2 RETURNING *',
        values: [id, g.user_id, g.user_role]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async deleteGroupMember(
    id: number,
    user_id: number
  ): Promise<GroupMemberType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'DELETE FROM group_members WHERE id=$1 AND user_id=$2 RETURNING id',
        values: [id, user_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default GroupMember;
