const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 8000;

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'db-aws.c9640gu4mb1d.us-east-1.rds.amazonaws.com',
  user: 'tgguser',
  password: 'mohasins123',
  database: 'aws'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Fetch all companies
app.get('/company', (req, res) => {
  const query = 'SELECT * FROM company';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Fetch company by ID
app.get('/company/:id', (req, res) => {
  const companyId = req.params.id;
  const query = 'SELECT * FROM company WHERE company_id = ?';
  db.query(query, [companyId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(result[0]);
  });
});

// Insert a new company
app.post('/company', (req, res) => {
  const {
    company_name,
    email,
    mobile_no,
    alternate_mobile_no,
    landline_no,
    address,
    website,
    logo,
    customer_prefix,
    invoice_prefix,
    gstin,
    panno,
    bank_name,
    bank_account_no,
    bank_ifsc_code,
    company_total
  } = req.body;

  const query = `INSERT INTO company (
    company_name, email, mobile_no, alternate_mobile_no, landline_no, address, 
    website, logo, customer_prefix, invoice_prefix, gstin, panno, 
    bank_name, bank_account_no, bank_ifsc_code, company_total
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;


  db.query(query, [
    company_name, email, mobile_no, alternate_mobile_no, landline_no, address,
    website, logo, customer_prefix, invoice_prefix, gstin, panno,
    bank_name, bank_account_no, bank_ifsc_code, company_total
  ], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json({ message: 'Company added successfully', companyId: result.insertId });
  });
});

// Update an existing company
app.put('/company/:company_id', (req, res) => {
  const companyId = req.params.company_id;
  const {
    company_name,
    email,
    mobile_no,
    alternate_mobile_no,
    landline_no,
    address,
    website,
    logo,
    customer_prefix,
    invoice_prefix,
    gstin,
    panno,
    bank_name,
    bank_account_no,
    bank_ifsc_code,
    company_total
  } = req.body;

  const query = `UPDATE company SET 
    company_name = ?, email = ?, mobile_no = ?, alternate_mobile_no = ?, 
    landline_no = ?, address = ?, website = ?, logo = ?, customer_prefix = ?, 
    invoice_prefix = ?, gstin = ?, panno = ?, bank_name = ?, bank_account_no = ?, 
    bank_ifsc_code = ?, company_total = ? WHERE company_id = ?`;

  db.query(query, [
    company_name, email, mobile_no, alternate_mobile_no, landline_no, address,
    website, logo, customer_prefix, invoice_prefix, gstin, panno,
    bank_name, bank_account_no, bank_ifsc_code, company_total, companyId
  ], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ message: 'Company updated successfully' });
  });
});

// Delete a company by ID
app.delete('/company/:company_id', (req, res) => {
  const companyId = req.params.company_id;
  const query = 'DELETE FROM company WHERE company_id = ?';

  db.query(query, [companyId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ message: 'Company deleted successfully' });
  });
});

// ==================== INVOICE ENDPOINTS ==================== //

// Fetch all invoices
app.get('/invoice', (req, res) => {
  const query = 'SELECT * FROM invoice';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Fetch invoice by ID
app.get('/invoice/:invoice_id', (req, res) => {
  const invoiceId = req.params.invoice_id;
  const query = 'SELECT * FROM invoice WHERE invoice_id = ?';
  db.query(query, [invoiceId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(result[0]);
  });
});

// Insert a new invoice
app.post('/invoice', (req, res) => {
  const {
    company_name,
    customer_name,
    bill_amount,
    invoice_date,
    updated_at
  } = req.body;

  const query = `INSERT INTO invoice (
    company_name, customer_name, bill_amount, invoice_date, updated_at
  ) VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [
    company_name, customer_name, bill_amount, invoice_date, updated_at
  ], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json({ message: 'Invoice added successfully', invoiceId: result.insertId });
  });
});

// Delete an invoice by ID
app.delete('/invoice/:invoice_id', (req, res) => {
  const invoiceId = req.params.invoice_id;
  const query = 'DELETE FROM invoice WHERE invoice_id = ?';

  db.query(query, [invoiceId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted successfully' });
  });
});

// ==================== CUSTOMER ENDPOINTS ==================== //

// Fetch all customers
app.get('/customer', (req, res) => {
  const query = 'SELECT * FROM customer';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Fetch customer by ID
app.get('/customer/:customer_id', (req, res) => {
  const customerId = req.params.customer_id;
  const query = 'SELECT * FROM customer WHERE customer_id = ?';
  db.query(query, [customerId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(result[0]);
  });
});

// Insert a new customer
app.post('/customer', (req, res) => {
  const { customer_name, company_name } = req.body;

  const query = `INSERT INTO customer (customer_name, company_name) VALUES (?, ?)`;

  db.query(query, [customer_name, company_name], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json({ message: 'Customer added successfully', customerId: result.insertId });
  });
});

// Delete a customer by ID
app.delete('/customer/:customer_id', (req, res) => {
  const customerId = req.params.customer_id;
  const query = 'DELETE FROM customer WHERE customer_id = ?';

  db.query(query, [customerId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
