import { PoolClient } from 'pg';
import { pgClient } from '../database';

export type UserCityType = {
  id: number;
  city: string;
  user_id: number;
};
class UserCity {
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
  async createUserCity(c: UserCityType): Promise<UserCityType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `
            INSERT INTO users_city (city, user_id)
            VALUES ($1, $2)
            RETURNING *
          `,
        values: [c.city, c.user_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async getUserCity(user_id: number): Promise<UserCityType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'SELECT city FROM users_city WHERE user_id=$1',
        values: [user_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async updateUserCity(
    user_id: number,
    c: UserCityType
  ): Promise<UserCityType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `UPDATE users_city SET city=$2 WHERE user_id=$1 RETURNING *`,
        values: [user_id, c.city]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async deleteUserCity(user_id: number): Promise<UserCityType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'DELETE FROM users_city WHERE user_id=$1 RETURNING id',
        values: [user_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default UserCity;
