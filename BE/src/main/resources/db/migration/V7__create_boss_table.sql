CREATE TABLE boss (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    max_health INT NOT NULL,
    current_health INT NOT NULL,
    created_at TIMESTAMP NOT NULL
);

INSERT INTO boss (name, max_health, current_health, created_at)
VALUES ('John Pikachu', 0, 0, CURRENT_TIMESTAMP);