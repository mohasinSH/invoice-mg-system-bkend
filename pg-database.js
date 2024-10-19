const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const fs = require('fs');
const path = require('path');
const app = express();
const port = 8000;

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// PostgreSQL connection setup
// const pool = new Pool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
//   ssl: {
//     rejectUnauthorized: false, // This allows self-signed certificates
//   },
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'your-internal-or-external-url',
  ssl: {
    rejectUnauthorized: false // For handling SSL certificates on Render
  }
});
console.log(process.env.DB_NAME)
// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error connecting to the database', err.stack);
  }

  console.log('Connected to the database');

  // Path to the schema.sql file in the same directory
  const sqlFilePath = path.join(__dirname, 'schema.sql');

  // Read the SQL file
  fs.readFile(sqlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading SQL file', err);
      return;
    }

    // Execute the SQL file's contents
    client.query(data, (err, res) => {
      release(); // Release the client back to the pool

      if (err) {
        console.error('Error executing SQL query', err.stack);
      } else {
        console.log('SQL file executed successfully:', res);
      }

      
     
    });
  });
});


// Fetch all companies
app.get('/company', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM company');
    res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Fetch company by ID
app.get('/company/:id', async (req, res) => {
  const companyId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM company WHERE company_id = $1', [companyId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Insert a new company
app.post('/company', async (req, res) => {
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
    } = req.body;
    const company_total = parseFloat(0).toFixed(2); // Ensures it’s in the right format

    const query = `INSERT INTO company (
      company_name, email, mobile_no, alternate_mobile_no, landline_no, address, 
      website, logo, customer_prefix, invoice_prefix, gstin, panno, 
      bank_name, bank_account_no, bank_ifsc_code, company_total
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING company_id`;
  
    try {
      const result = await pool.query(query, [
        company_name, email, mobile_no, alternate_mobile_no, landline_no, address,
        website, logo, customer_prefix, invoice_prefix, gstin, panno,
        bank_name, bank_account_no, bank_ifsc_code,company_total
      ]);
      res.json({ message: 'Company added successfully', companyId: result.rows[0].company_id });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
  });
  

// Update an existing company
app.put('/company/:company_id', async (req, res) => {
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
    company_total,
  } = req.body;

  const query = `UPDATE company SET 
    company_name = $1, email = $2, mobile_no = $3, alternate_mobile_no = $4, 
    landline_no = $5, address = $6, website = $7, logo = $8, customer_prefix = $9, 
    invoice_prefix = $10, gstin = $11, panno = $12, bank_name = $13, bank_account_no = $14, 
    bank_ifsc_code = $15, company_total = $16 WHERE company_id = $17`;

  try {
    const result = await pool.query(query, [
      company_name, email, mobile_no, alternate_mobile_no, landline_no, address,
      website, logo, customer_prefix, invoice_prefix, gstin, panno,
      bank_name, bank_account_no, bank_ifsc_code, company_total, companyId,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ message: 'Company updated successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Delete a company by ID
app.delete('/company/:company_id', async (req, res) => {
  const companyId = req.params.company_id;
  const query = 'DELETE FROM company WHERE company_id = $1';

  try {
    const result = await pool.query(query, [companyId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ message: 'Company deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// ==================== INVOICE ENDPOINTS ==================== //

// Fetch all invoices
app.get('/invoice', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invoice');
    res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Fetch invoice by ID
app.get('/invoice/:invoice_id', async (req, res) => {
  const invoiceId = req.params.invoice_id;
  try {
    const result = await pool.query('SELECT * FROM invoice WHERE invoice_id = $1', [invoiceId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Insert a new invoice
app.post('/invoice', async (req, res) => {
  const {
    company_name,
    customer_name,
    bill_amount,
  } = req.body;

  const query = `INSERT INTO invoice (
    company_name, customer_name, bill_amount
  ) VALUES ($1, $2, $3) RETURNING invoice_id`;

  try {
    const result = await pool.query(query, [company_name, customer_name, bill_amount]);
    res.json({ message: 'Invoice added successfully', invoiceId: result.rows[0].invoice_id });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Delete an invoice by ID
app.delete('/invoice/:invoice_id', async (req, res) => {
  const invoiceId = req.params.invoice_id;
  const query = 'DELETE FROM invoice WHERE invoice_id = $1';

  try {
    const result = await pool.query(query, [invoiceId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// ==================== CUSTOMER ENDPOINTS ==================== //

// Fetch all customers
app.get('/customer', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer');
    res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Fetch customer by ID
app.get('/customer/:customer_id', async (req, res) => {
  const customerId = req.params.customer_id;
  try {
    const result = await pool.query('SELECT * FROM customer WHERE customer_id = $1', [customerId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Insert a new customer
app.post('/customer', async (req, res) => {
  const { customer_name, company_name } = req.body;

  const query = `INSERT INTO customer (customer_name, company_name) VALUES ($1, $2) RETURNING customer_id`;

  try {
    const result = await pool.query(query, [customer_name, company_name]);
    res.json({ message: 'Customer added successfully', customerId: result.rows[0].customer_id });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Delete a customer by ID
app.delete('/customer/:customer_id', async (req, res) => {
  const customerId = req.params.customer_id;
  const query = 'DELETE FROM customer WHERE customer_id = $1';

  try {
    const result = await pool.query(query, [customerId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

app.put('/company/set-total/:id', async (req, res) => {
    const companyId = req.params.id; // Extract company ID from URL parameters
    const { bill_amount } = req.body; // Extract bill amount from the request body

    // Check if bill_amount is provided and is a valid number
    if (typeof bill_amount !== 'number' || bill_amount < 0) {
        return res.status(400).json({ error: 'Invalid bill amount' });
    }

    const query = `
        UPDATE company
        SET company_total = company_total + $1
        WHERE company_id = $2
        RETURNING company_total;
    `;

    try {
        const result = await pool.query(query, [bill_amount, companyId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }
        const updatedTotal = result.rows[0].company_total;
        res.json({ message: 'Company total updated successfully', company_total: updatedTotal });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error', details: err.message });
    }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
