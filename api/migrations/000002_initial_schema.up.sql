BEGIN;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id),
  UNIQUE (NAME, user_id)
);

CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  currency VARCHAR(3) NOT NULL,
  rate DECIMAL NOT NULL DEFAULT 1,
  total DECIMAL NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TYPE FREQ AS ENUM ('yearly', 'monthly', 'weekly');

CREATE TABLE recurring_expenses (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL,
  user_id INT NOT NULL,
  frequency FREQ NOT NULL,
  name VARCHAR(255) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  total DECIMAL,
  FOREIGN KEY (category_id) REFERENCES categories (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE incomplete_expenses (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  currency VARCHAR(3) NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

COMMIT;
