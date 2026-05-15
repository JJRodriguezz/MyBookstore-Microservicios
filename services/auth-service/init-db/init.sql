CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE,
  password TEXT
);

-- Usuarios alineados con user-service (mismos id que los INSERT de userdb): Juan id=1, María id=2
-- Contraseña para ambos en demo: test123
INSERT INTO users (id, email, password) VALUES
  (1, 'juan@test.com', '$2b$10$NtuZ/YDeTWHExXUTCBc.t.y9QyGUh4SVBzb1M5j3cZVbNQIm2uJ.6'),
  (2, 'maria@test.com', '$2b$10$NtuZ/YDeTWHExXUTCBc.t.y9QyGUh4SVBzb1M5j3cZVbNQIm2uJ.6')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT COALESCE(MAX(id), 1) FROM users));