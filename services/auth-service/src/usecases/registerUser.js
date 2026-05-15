import bcrypt from "bcryptjs";

export class RegisterUserUseCase {
  constructor(pool) {
    this.pool = pool;
    this.userServiceUrl =
      process.env.USER_SERVICE_URL || "http://localhost:3001";
  }

  async execute(name, email, password) {
    if (!email || !password) {
      throw new Error("email and password are required");
    }

    const hashed = await bcrypt.hash(password, 10);

    const displayName = name?.trim() || email.split("@")[0];

    const userRes = await fetch(`${this.userServiceUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: displayName, email }),
    });

    if (!userRes.ok) {
      const err = await userRes.json().catch(() => ({}));
      throw new Error(err.error || "Could not create user profile");
    }

    const profile = await userRes.json();

    try {
      const res = await this.pool.query(
        "INSERT INTO users (id, email, password) VALUES ($1, $2, $3) RETURNING id, email",
        [profile.id, email, hashed]
      );

      await this.pool.query(
        `SELECT setval(pg_get_serial_sequence('users','id'), (SELECT COALESCE(MAX(id), 1) FROM users))`
      );

      return res.rows[0];
    } catch (e) {
      if (e.code === "23505") {
        throw new Error("Email already registered");
      }
      throw e;
    }
  }
}
