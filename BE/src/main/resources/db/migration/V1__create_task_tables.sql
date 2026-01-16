CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(32) NOT NULL,
    description VARCHAR(500),
    status VARCHAR(32) NOT NULL,
    energy_cost INT NOT NULL,
    damage INT NOT NULL,
    procrastination_damage INT NOT NULL,
    creation_date DATE NOT NULL,
    last_update_date DATE
);

CREATE TABLE task_dependencies (
    task_id INT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    parent_task_id INT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, parent_task_id)
);