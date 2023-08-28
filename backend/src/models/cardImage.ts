import { PoolClient } from 'pg';

export type CardImageType = {
  id: number;
  image_url: string;
  user_id: number;
};
class CardImage {
  async createCardImage(
    connection: PoolClient,
    ci: CardImageType
  ): Promise<CardImageType> {
    const query = {
      text: 'INSERT INTO card_images (image_url, user_id) VALUES ($1, $2) RETURNING *',
      values: [ci.image_url, ci.user_id]
    };
    const result = await connection.query(query);
    return result.rows[0].id;
  }
  async updateCardImage(
    connection: PoolClient,
    ci: CardImageType
  ): Promise<CardImageType> {
    const query = {
      text: `UPDATE card_images SET image_url=$2 WHERE id=$1 RETURNING *`,
      values: [ci.id, ci.image_url]
    };
    const result = await connection.query(query);
    return result.rows[0];
  }
  async deleteCardImage(
    connection: PoolClient,
    id: number
  ): Promise<CardImageType> {
    const query = {
      text: 'DELETE FROM card_images WHERE id=$1 RETURNING id',
      values: [id]
    };
    const result = await connection.query(query);
    return result.rows[0];
  }
}
export default CardImage;
