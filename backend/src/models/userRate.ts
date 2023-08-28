import { PoolClient } from 'pg';
import { pgClient } from '../database';
import Password, { PasswordType } from './password';

enum UserRateEnum {
  'ONE_STAR' = 1,
  'TWO_STARS' = 2,
  'THREE_STARS' = 3,
  'FOUR_STARS' = 4,
  'FIVE_STARS' = 5
}
export type UserRateType = {
  id: number;
  user_id: number;
  client_id: number;
  rate: UserRateEnum;
  comment: string;
  created_at?: Date;
  updated_at?: Date;
};
class UserRate {
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
  async withTransaction<T>(
    connection: PoolClient,
    callback: () => Promise<T>
  ): Promise<T> {
    try {
      await connection.query('BEGIN');
      const result = await callback();
      await connection.query('COMMIT');
      return result;
    } catch (error) {
      await connection.query('ROLLBACK');
      throw error;
    }
  }
}
export default UserRate;
