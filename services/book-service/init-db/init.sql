CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title TEXT,
  author TEXT
);

INSERT INTO books (title, author)
VALUES 
('1984', 'George Orwell'),
('Sapiens', 'Yuval Noah Harari'),
('El arte de la guerra', 'Sun Tzu');