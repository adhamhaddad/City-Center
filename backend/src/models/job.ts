import { PoolClient } from 'pg';
import { pgClient } from '../database';
import Date, { DateType } from './date';
import JobDocument, { JobDocumentType } from './jobDocument';

type JobType = {
  id: number;
  name: string;
  title: string;
  document_id: number;
  date_id: number;
  user_id: number;
  is_verified: boolean;
};
class Job {
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
  async createJob(j: JobType & DateType & JobDocumentType): Promise<JobType> {
    return this.withConnection(async (connection: PoolClient) => {
      return this.withTransaction(connection, async () => {
        // Date
        const date = new Date();
        const date_id = await date.createDate(connection, j);

        // Job Documents
        const jobDocument = new JobDocument();
        const card_id = await jobDocument.createJobDocument(connection, j);

        // Job
        const query = {
          text: `
            INSERT INTO jobs (name, title, card_id, date_id, user_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
          values: [j.name, j.title, card_id, date_id, j.user_id]
        };
        const result = await connection.query(query);
        return result.rows[0];
      });
    });
  }
  async getJobs(user_id: number): Promise<JobType[]> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `
        SELECT j.name, j.title, d.start_date, d.end_date
        FROM jobs j
        LEFT JOIN dates d ON d.id = j.date_id
        WHERE j.user_id=$1
        `,
        values: [user_id]
      };
      const result = await connection.query(query);
      return result.rows;
    });
  }
  async getJob(id: number, user_id: number): Promise<JobType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `
        SELECT j.name, j.title, d.start_date, d.end_date
        FROM jobs j
        LEFT JOIN dates d ON d.id = j.date_id
        WHERE j.id=$1 AND j.user_id=$2
        `,
        values: [id, user_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async updateJob(id: number, j: JobType & DateType): Promise<JobType> {
    return this.withConnection(async (connection: PoolClient) => {
      return this.withTransaction(connection, async () => {
        // Job
        const query = {
          text: `UPDATE jobs SET name=$3, title=$4 WHERE id=$1 AND user_id=$2 RETURNING *`,
          values: [id, j.user_id, j.name, j.title]
        };
        const result = await connection.query(query);
        // Date
        const date = new Date();
        await date.updateDate(connection, j);
        return result.rows[0];
      });
    });
  }
  async deleteJob(id: number, user_id: number): Promise<JobType> {
    return this.withConnection(async (connection: PoolClient) => {
      return this.withTransaction(connection, async () => {
        // College
        const query = {
          text: 'DELETE FROM jobs WHERE id=$1 AND user_id=$2 RETURNING id, date_id',
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
export default Job;
