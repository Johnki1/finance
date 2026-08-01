-- Migración: Agregar campo is_active a users y crear tabla verification_token

-- Agregar columna is_active con DEFAULT TRUE para no bloquear cuentas existentes
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Tabla para tokens de verificación y recuperación de contraseña
CREATE TABLE IF NOT EXISTS verification_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índice para búsquedas rápidas por token
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);

-- Índice para búsquedas por usuario
CREATE INDEX IF NOT EXISTS idx_verification_tokens_user_id ON verification_tokens(user_id);
