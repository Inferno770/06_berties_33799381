# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price) VALUES
('Brighton Rock', 20.25),
('Brave New World', 25.00), 
('Animal Farm', 12.99);

INSERT INTO users (username, first_name, last_name, email, hashedPassword)
VALUES ('gold', 'Goldie', 'Smith', 'gold@example.com', '$2b$10$ySyNN9rERMDFRne.owmWleroI0fqkBT1tCQd43Tomzxc/9dbWr.TG');