CREATE TABLE IF NOT EXISTS income (
    id          BIGSERIAL    PRIMARY KEY,
    description VARCHAR(255)  NOT NULL,
    amount      DECIMAL(12,2) NOT NULL,
    date        DATE          NOT NULL,
    category    VARCHAR(100),
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fixed_expense (
    id          BIGSERIAL    PRIMARY KEY,
    description VARCHAR(255)  NOT NULL,
    amount      DECIMAL(12,2) NOT NULL,
    category    VARCHAR(100)  NOT NULL,
    due_day     INTEGER       CHECK (due_day BETWEEN 1 AND 31),
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS variable_expense (
    id          BIGSERIAL    PRIMARY KEY,
    description VARCHAR(255)  NOT NULL,
    amount      DECIMAL(12,2) NOT NULL,
    date        DATE          NOT NULL,
    category    VARCHAR(100),
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_income_date         ON income (date);
CREATE INDEX idx_fixed_expense_category ON fixed_expense (category);
CREATE INDEX idx_variable_expense_date  ON variable_expense (date);