import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class LoginUserUseCase {
  constructor(pool) {
    this.pool = pool;
  }

  async execute(email, password) {
    const res = await this.pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = res.rows[0];
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid password");

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, userId: user.id };
  }
}