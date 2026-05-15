export class PostgresOrderRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async create(order) {
    const res = await this.pool.query(
      "INSERT INTO orders (user_id, book_id) VALUES ($1,$2) RETURNING *",
      [order.user_id, order.book_id]
    );
    return res.rows[0];
  }

  async findAll() {
    const res = await this.pool.query("SELECT * FROM orders");
    return res.rows;
  }

  async findById(id) {
    const res = await this.pool.query(
      "SELECT * FROM orders WHERE id = $1",
      [id]
    );
    return res.rows[0];
  }
}