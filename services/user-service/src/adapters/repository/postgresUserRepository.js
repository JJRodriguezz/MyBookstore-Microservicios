export class PostgresUserRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async findById(id) {
    const res = await this.pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    return res.rows[0];
  }

  async findAll() {
    const res = await this.pool.query("SELECT * FROM users");
    return res.rows;
  }

  async create(name, email) {
  const result = await this.pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  return result.rows[0];
  }
}