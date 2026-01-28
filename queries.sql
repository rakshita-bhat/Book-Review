CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  isbn VARCHAR(20) NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  read_date DATE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 10) 
);


INSERT INTO books (isbn, title, author, read_date, rating)
VALUES (
  '066578970X',
  'The Land of Oz',
  'L. Frank Baum',
  '2025-04-20',
  7 
);

INSERT INTO books (isbn, title, author, read_date, rating)
VALUES (
  '0765319853',
  'Little Brother',
  'Cory Doctorow',
  '2024-07-20',
  9
);