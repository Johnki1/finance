CREATE TABLE IF NOT EXISTS users (
    id         BIGSERIAL    PRIMARY KEY,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(50)  NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

ALTER TABLE income
ADD COLUMN user_id BIGINT NOT NULL,
ADD CONSTRAINT fk_income_user FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE fixed_expense
ADD COLUMN user_id BIGINT NOT NULL,
ADD CONSTRAINT fk_fixed_expense_user FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE variable_expense
ADD COLUMN user_id BIGINT NOT NULL,
ADD CONSTRAINT fk_variable_expense_user FOREIGN KEY (user_id) REFERENCES users(id);

CREATE INDEX idx_income_user_id          ON income (user_id);
CREATE INDEX idx_fixed_expense_user_id   ON fixed_expense (user_id);
CREATE INDEX idx_variable_expense_user_id ON variable_expense (user_id);