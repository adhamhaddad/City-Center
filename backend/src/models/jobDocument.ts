import { PoolClient } from 'pg';

export type JobDocumentType = {
  id: number;
  image_url?: string;
  file_url?: string;
  user_id: number;
};
class JobDocument {
  async createJobDocument(
    connection: PoolClient,
    jd: JobDocumentType
  ): Promise<JobDocumentType> {
    const query = {
      text: 'INSERT INTO job_documents (image_url, user_id) VALUES ($1, $2) RETURNING *',
      values: [jd.image_url, jd.user_id]
    };
    const result = await connection.query(query);
    return result.rows[0].id;
  }
  async updateJobDocument(
    connection: PoolClient,
    jd: JobDocumentType
  ): Promise<JobDocumentType> {
    const query = {
      text: `UPDATE job_documents SET image_url=$2 WHERE id=$1 RETURNING *`,
      values: [jd.id, jd.image_url]
    };
    const result = await connection.query(query);
    return result.rows[0];
  }
  async deleteJobDocument(
    connection: PoolClient,
    id: number
  ): Promise<JobDocumentType> {
    const query = {
      text: 'DELETE FROM job_documents WHERE id=$1 RETURNING id',
      values: [id]
    };
    const result = await connection.query(query);
    return result.rows[0];
  }
}
export default JobDocument;
