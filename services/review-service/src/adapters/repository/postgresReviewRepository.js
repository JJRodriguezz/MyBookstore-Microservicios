export class PostgresReviewRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async create(review) {
    const res = await this.pool.query(
      "INSERT INTO reviews (book_id, user_id, content) VALUES ($1,$2,$3) RETURNING *",
      [review.book_id, review.user_id, review.content]
    );
    return res.rows[0];
  }

  async findByBook(bookId) {
    const res = await this.pool.query(
      "SELECT * FROM reviews WHERE book_id = $1",
      [bookId]
    );
    return res.rows;
  }
}