export class PostgresBookRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async findById(id) {
    const result = await this.pool.query(
      "SELECT * FROM books WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await this.pool.query("SELECT * FROM books");
    return result.rows;
  }

  async create(title, author) {
  const result = await this.pool.query(
    "INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *",
    [title, author]
  );
  return result.rows[0];
  } 
}