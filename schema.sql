
CREATE TABLE IF NOT EXISTS company (
  company_id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  mobile_no VARCHAR(20),
  alternate_mobile_no VARCHAR(20),
  landline_no VARCHAR(20),
  address TEXT,
  website VARCHAR(255),
  logo TEXT,
  customer_prefix VARCHAR(50),
  invoice_prefix VARCHAR(50),
  gstin VARCHAR(20),
  panno VARCHAR(20),
  bank_name VARCHAR(255),
  bank_account_no VARCHAR(50),
  bank_ifsc_code VARCHAR(20),
  company_total NUMERIC(10, 2)
);


CREATE TABLE IF NOT EXISTS invoice (
  invoice_id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  bill_amount NUMERIC(10, 2) NOT NULL
);


CREATE TABLE IF NOT EXISTS customer (
  customer_id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users (username, password)
SELECT 'root', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'root');
