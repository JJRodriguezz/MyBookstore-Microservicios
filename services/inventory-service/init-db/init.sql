CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  book_id TEXT UNIQUE,
  quantity INT
);

INSERT INTO inventory (book_id, quantity) VALUES
('1', 10),
('2', 5),
('3', 0);