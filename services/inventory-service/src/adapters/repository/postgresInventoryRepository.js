export class PostgresInventoryRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async findByBookId(bookId) {
    const res = await this.pool.query(
      "SELECT * FROM inventory WHERE book_id = $1",
      [bookId]
    );
    return res.rows[0];
  }

  async decreaseStock(bookId) {
    const res = await this.pool.query(
      "UPDATE inventory SET quantity = quantity - 1 WHERE book_id = $1 AND quantity > 0 RETURNING *",
      [bookId]
    );
    return res.rows[0];
  }
}