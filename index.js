// const mysql = require('mysql2/promise');

// // MySQL connection setup
// const dbConfig = {
//   host: 'db-aws.c9640gu4mb1d.us-east-1.rds.amazonaws.com',
//   user: 'tgguser',
//   password: 'mohasins123',
//   database: 'aws'
// };

// // Create MySQL connection pool
// const pool = mysql.createPool(dbConfig);

// // Helper to send a JSON response
// const sendResponse = (statusCode, data) => ({
//   statusCode: statusCode,
//   headers: {
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': '*', // Required for CORS support to work
//   },
//   body: JSON.stringify(data),
// });

// // Lambda function handler
// exports.handler = async (event) => {
//   const { httpMethod, path, pathParameters, queryStringParameters, body } = event;
//   let response;

//   try {
//     // Route the requests based on path and HTTP method
//     if (path === '/company' && httpMethod === 'GET') {
//       response = await getAllCompanies();
//     } else if (path.startsWith('/company') && httpMethod === 'GET') {
//       const companyId = pathParameters.id;
//       response = await getCompanyById(companyId);
//     } else if (path === '/company' && httpMethod === 'POST') {
//       const companyData = JSON.parse(body);
//       response = await insertCompany(companyData);
//     } else if (path.startsWith('/company') && httpMethod === 'PUT') {
//       const companyId = pathParameters.id;
//       const companyData = JSON.parse(body);
//       response = await updateCompany(companyId, companyData);
//     } else if (path.startsWith('/company') && httpMethod === 'DELETE') {
//       const companyId = pathParameters.id;
//       response = await deleteCompany(companyId);
//     }

//     // Invoice routes
//     else if (path === '/invoice' && httpMethod === 'GET') {
//       response = await getAllInvoices();
//     } else if (path.startsWith('/invoice') && httpMethod === 'GET') {
//       const invoiceId = pathParameters.id;
//       response = await getInvoiceById(invoiceId);
//     } else if (path === '/invoice' && httpMethod === 'POST') {
//       const invoiceData = JSON.parse(body);
//       response = await insertInvoice(invoiceData);
//     } else if (path.startsWith('/invoice') && httpMethod === 'DELETE') {
//       const invoiceId = pathParameters.id;
//       response = await deleteInvoice(invoiceId);
//     }

//     // Customer routes
//     else if (path === '/customer' && httpMethod === 'GET') {
//       response = await getAllCustomers();
//     } else if (path.startsWith('/customer') && httpMethod === 'GET') {
//       const customerId = pathParameters.id;
//       response = await getCustomerById(customerId);
//     } else if (path === '/customer' && httpMethod === 'POST') {
//       const customerData = JSON.parse(body);
//       response = await insertCustomer(customerData);
//     } else if (path.startsWith('/customer') && httpMethod === 'DELETE') {
//       const customerId = pathParameters.id;
//       response = await deleteCustomer(customerId);
//     }

//     // Default response
//     else {
//       response = sendResponse(404, { message: 'Route not found' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     response = sendResponse(500, { error: 'Server error', details: error.message });
//   }

//   return response;
// };

// // ==================== COMPANY FUNCTIONS ==================== //
// // Fetch all companies
// const getAllCompanies = async () => {
//   try {
//     const query = 'SELECT * FROM company';
//     const [results] = await pool.query(query);
//     return sendResponse(200, results);
//   } catch (err) {
//     return sendResponse(500, { error: 'Database error', details: err.message });
//   }
// };

// // Fetch company by ID
// const getCompanyById = async (companyId) => {
//   try {
//     const query = 'SELECT * FROM company WHERE company_id = ?';
//     const [result] = await pool.query(query, [companyId]);
//     if (result.length === 0) {
//       return sendResponse(404, { message: 'Company not found' });
//     }
//     return sendResponse(200, result[0]);
//   } catch (err) {
//     return sendResponse(500, { error: 'Database error', details: err.message });
//   }
// };

// // Insert a new company
// const insertCompany = async (companyData) => {
//   const {
//     company_name, email, mobile_no, alternate_mobile_no, landline_no, address,
//     website, logo, customer_prefix, invoice_prefix, gstin, panno,
//     bank_name, bank_account_no, bank_ifsc_code
//   } = companyData;

//   const query = `
//     INSERT INTO company (
//       company_name, email, mobile_no, alternate_mobile_no, landline_no, address,
//       website, logo, customer_prefix, invoice_prefix, gstin, panno,
//       bank_name, bank_account_no, bank_ifsc_code, company_total
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
//   `;

//   try {
//     const [result] = await pool.query(query, [
//       company_name, email, mobile_no, alternate_mobile_no, landline_no, address,
//       website, logo, customer_prefix, invoice_prefix, gstin, panno,
//       bank_name, bank_account_no, bank_ifsc_code
//     ]);
//     return sendResponse(201, { message: 'Company added successfully', companyId: result.insertId });
//   } catch (err) {
//     return sendResponse(500, { error: 'Database error', details: err.message });
//   }
// };
// // Update a company
// const updateCompany = async (companyId, companyData) => {
//   const {
//     company_name, email, mobile_no, alternate_mobile_no, landline_no, address,
//     website, logo, customer_prefix, invoice_prefix, gstin, panno,
//     bank_name, bank_account_no, bank_ifsc_code
//   } = companyData;

//   const query = `
//     UPDATE company
//     SET
//       company_name = ?, email = ?, mobile_no = ?, alternate_mobile_no = ?, landline_no = ?, address = ?,
//       website = ?, logo = ?, customer_prefix = ?, invoice_prefix = ?, gstin = ?, panno = ?,
//       bank_name = ?, bank_account_no = ?, bank_ifsc_code = ?
//     WHERE company_id = ?
//   `;

//   try {
//     const [result] = await pool.query(query, [
//       company_name, email, mobile_no, alternate_mobile_no, landline_no, address,
//       website, logo, customer_prefix, invoice_prefix, gstin, panno,
//       bank_name, bank_account_no, bank_ifsc_code, companyId
//     ]);

//     if (result.affectedRows === 0) {
//       return sendResponse(404, { message: 'Company not found' });
//     }

//     return sendResponse(200, { message: 'Company updated successfully' });
//   } catch (err) {
//     return sendResponse(500, { error: 'Database error', details: err.message });
//   }
// };

// // Delete a company
// const deleteCompany = async (companyId) => {
//   const query = 'DELETE FROM company WHERE company_id = ?';

//   try {
//     const [result] = await pool.query(query, [companyId]);

//     if (result.affectedRows === 0) {
//       return sendResponse(404, { message: 'Company not found' });
//     }

//     return sendResponse(200, { message: 'Company deleted successfully' });
//   } catch (err) {
//     return sendResponse(500, { error: 'Database error', details: err.message });
//   }
// };

// // Update a company, delete company, etc. (Same as above)

// // ==================== INVOICE FUNCTIONS ==================== //
// // Fetch all invoices
// const getAllInvoices = async () => {
//   try {
//     const query = 'SELECT * FROM invoice';
//     const [results] = await pool.query(query);
//     return sendResponse(200, results);
//   } catch (err) {
//     return sendResponse(500, { error: 'Database error', details: err.message });
//   }
// };

// // Fetch invoice by ID
// const getInvoiceById = async (invoiceId) => {
//   try {
//     const query = 'SELECT * FROM invoice WHERE invoice_id = ?';
//     const [result] = await pool.query(query, [invoiceId]);
//     if (result.length === 0) {
//       return sendResponse(404, { message: 'Invoice not found' });
//     }
//     return sendResponse(200, result[0]);
//   } catch (err) {
//     return sendResponse(500, { error: 'Database error', details: err.message });
//   }
// };

// // Insert a new invoice
// const insertInvoice = async (invoiceData) => {
//   const { company_name, customer_name, bill_amount } = invoiceData;

//   const query = `
//     INSERT INTO invoice (company_name, customer_name, bill_amount)
//     VALUES (?, ?, ?)
//   `;

//   try {
//     const [result] = await pool.query(query, [company_name, customer_name, bill_amount]);
//     return sendResponse(201, { message: 'Invoice added successfully', invoiceId: result.insertId });
//   } catch (err) {
//     return sendResponse(500, { error: 'Database error', details: err.message });
//   }
// };

// // Delete an invoice
// const deleteInvoice = async (invoiceId) => {
//   const query = 'DELETE FROM invoice WHERE invoice_id = ?';

//   try {
//     const [result] = await pool.query(query, [invoiceId]);
//     if (result.affectedRows === 0) {
//       return sendResponse(404, { message: 'Invoice not found' });
//     }
//     return sendResponse(200, { message: 'Invoice deleted successfully' });
//   } catch (err) {
//     return sendResponse(500, { error: 'Database error', details: err.message });
//   }
// };

// // ==================== CUSTOMER FUNCTIONS ==================== //
// // Fetch all customers
// const getAllCustomers = async () => {
//   try {
//     const query = 'SELECT * FROM customer';
//     const [results] = await pool.query(query);
//     return sendResponse(200, results);
//   } catch (err) {
//     return sendResponse(500, { error: 'Database error', details: err.message });
//   }
// };

// // Fetch customer by ID
// const getCustomerById = async (customerId) => {
//   try {
//     const query = 'SELECT * FROM customer WHERE customer_id = ?';
//     const [result] = await pool.query(query, [customerId]);
//     if (result.length === 0) {
//       return sendResponse(404, { message: 'Customer not found' });
//     }
//     return sendResponse(200, result[0]);
//   } catch (err) {
//     return sendResponse(500, { error: 'Database error', details: err.message });
//   }
// };

// // Insert a new customer
// const insertCustomer = async (customerData) => {
//   const { customer_name, company_name } = customerData;

//   const query = `
//     INSERT INTO customer (customer_name, company_name)
//     VALUES (?, ?)
//   `;

//   try {
//     const [result] = await pool.query(query, [customer_name, company_name]);
//     return sendResponse(201, { message: 'Customer added successfully', customerId: result.insertId });
//   } catch (err) {
//     return sendResponse(500, { error: 'Database error', details: err.message });
//   }
// };

// // Delete a customer
// const deleteCustomer = async (customerId) => {
//   const query = 'DELETE FROM customer WHERE customer_id = ?';

//   try {
//     const [result] = await pool.query(query, [customerId]);
//     if (result.affectedRows === 0) {
//       return sendResponse(404, { message: 'Customer not found' });
//     }
//     return sendResponse(200, { message: 'Customer deleted successfully' });
//   } catch (err) {
//     return sendResponse(500, { error: 'Database error', details: err.message });
//   }
// };
