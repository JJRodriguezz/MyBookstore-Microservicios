CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  book_id TEXT,
  user_id TEXT,
  content TEXT
);