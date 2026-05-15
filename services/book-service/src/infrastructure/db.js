import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function connectWithRetry() {
  let retries = 15; // 🔥 más intentos

  while (retries > 0) {
    try {
      await pool.query("SELECT 1");
      console.log("✅ Connected to PostgreSQL");
      return;
    } catch (err) {
      console.log(`⏳ Waiting for PostgreSQL... (${retries})`);
      retries--;
      await new Promise(res => setTimeout(res, 2000));
    }
  }

  console.error("❌ Could not connect to PostgreSQL");
  process.exit(1); // importante
}

await connectWithRetry();

export { pool };