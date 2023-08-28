import { PoolClient } from 'pg';
import { pgClient } from '../database';
import Date, { DateType } from './date';
import CardImage, { CardImageType } from './cardImage';

type CollegeType = {
  id: number;
  name: string;
  major: string;
  level: string;
  card_id: number;
  date_id: number;
  user_id: number;
  is_verified: boolean;
};
class College {
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
  async createCollege(
    c: CollegeType & DateType & CardImageType
  ): Promise<CollegeType> {
    return this.withConnection(async (connection: PoolClient) => {
      return this.withTransaction(connection, async () => {
        // Date
        const date = new Date();
        const date_id = await date.createDate(connection, c);

        // Card Image
        const cardImage = new CardImage();
        const card_id = await cardImage.createCardImage(connection, c);

        // College
        const query = {
          text: `
            INSERT INTO colleges (name, major, level, card_id, date_id, user_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
          values: [c.name, c.major, c.level, card_id, date_id, c.user_id]
        };
        const result = await connection.query(query);
        return result.rows[0];
      });
    });
  }
  async getColleges(user_id: number): Promise<CollegeType[]> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `
        SELECT c.name, c.major, c.level, d.start_date, d.end_date
        FROM colleges c
        LEFT JOIN dates d ON d.id = c.date_id
        WHERE c.user_id=$1
        `,
        values: [user_id]
      };
      const result = await connection.query(query);
      return result.rows;
    });
  }
  async getCollege(id: number, user_id: number): Promise<CollegeType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `
        SELECT c.name, c.major, c.level, d.start_date, d.end_date
        FROM colleges c
        LEFT JOIN dates d ON d.id = c.date_id
        WHERE c.id=$1 AND c.user_id=$2
        `,
        values: [id, user_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async updateCollege(
    id: number,
    c: CollegeType & DateType
  ): Promise<CollegeType> {
    return this.withConnection(async (connection: PoolClient) => {
      return this.withTransaction(connection, async () => {
        // College
        const query = {
          text: `UPDATE colleges SET name=$3, major=$4, level=$5 WHERE id=$1 AND user_id=$2 RETURNING *`,
          values: [id, c.user_id, c.name, c.major, c.level]
        };
        const result = await connection.query(query);
        // Date
        const date = new Date();
        await date.updateDate(connection, c);
        return result.rows[0];
      });
    });
  }
  async deleteCollege(id: number, user_id: number): Promise<CollegeType> {
    return this.withConnection(async (connection: PoolClient) => {
      return this.withTransaction(connection, async () => {
        // College
        const query = {
          text: 'DELETE FROM colleges WHERE id=$1 AND user_id=$2 RETURNING id, date_id',
          values: [id, user_id]
        };
        const result = await connection.query(query);
        // Date
        const date = new Date();
        await date.deleteDate(connection, result.rows[0].date_id);
        return result.rows[0];
      });
    });
  }
}
export default College;
