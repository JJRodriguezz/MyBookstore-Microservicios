CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT
);

INSERT INTO users (name, email)
VALUES 
('Juan Perez', 'juan@test.com'),
('Maria Lopez', 'maria@test.com');