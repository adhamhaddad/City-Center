import { PoolClient } from 'pg';
import { pgClient } from '../database';

export type BirthDateType = {
  id: number;
  birth_date: Date;
  user_id: number;
};
class BirthDate {
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
  async createBirthDate(b: BirthDateType): Promise<BirthDateType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `
            INSERT INTO birth_dates (birth_date, user_id)
            VALUES ($1, $2)
            RETURNING *
          `,
        values: [b.birth_date, b.user_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async getBirthDate(user_id: number): Promise<BirthDateType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'SELECT birth_date FROM birth_dates WHERE user_id=$1',
        values: [user_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async updateBirthDate(
    user_id: number,
    b: BirthDateType
  ): Promise<BirthDateType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `UPDATE birth_dates SET birth_date=$2 WHERE user_id=$1 RETURNING *`,
        values: [user_id, b.birth_date]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async deleteBirthDate(user_id: number): Promise<BirthDateType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'DELETE FROM birth_dates WHERE user_id=$1 RETURNING id',
        values: [user_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default BirthDate;
