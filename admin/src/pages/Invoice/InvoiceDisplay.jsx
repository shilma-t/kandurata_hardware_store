import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf'; // Import jsPDF for generating PDFs
import 'jspdf-autotable'; // Import jsPDF Autotable for table formatting in PDF
import './InvoiceDisplay.css'; // Import the CSS file
import Sidebar from '../../components/Sidebar/CSidebar'; // Import the Sidebar component

const InvoiceDisplay = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(''); // To store selected customer

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/invoice'); // API endpoint for fetching invoices
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const data = await response.json();
        setInvoices(data); // Assuming data is an array of invoices
      } catch (error) {
        console.error(error);
      }
    };

    fetchInvoices();
  }, []);

  // Get unique customer names for the dropdown
  const uniqueCustomers = [...new Set(invoices.map(invoice => invoice.customerName))];

  // Filter invoices based on the selected customer
  const filteredInvoices = selectedCustomer === ''
    ? invoices // Show all invoices if "Select Customer" is selected
    : invoices.filter(invoice => invoice.customerName === selectedCustomer);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to generate a consolidated PDF for the selected customer
  const generatePDFForCustomer = () => {
    if (filteredInvoices.length === 0) {
      alert('No invoices found for this customer.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Customer: ${selectedCustomer || 'All Customers'}`, 20, 20);

    filteredInvoices.forEach((invoice, index) => {
      doc.setFontSize(12);
      doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 20, 30 + index * 60);
      doc.text(`Date: ${formatDate(invoice.createdAt)}`, 20, 40 + index * 60);
      doc.text(`Discount: ${invoice.discount}`, 20, 50 + index * 60);
      doc.text(`Total Amount: ${invoice.totalAmount}`, 20, 60 + index * 60);

      const itemRows = invoice.items.map(item => [item.name, item.quantity, item.price]);

      // Use autoTable plugin to format the items in a table format
      doc.autoTable({
        head: [['Item', 'Quantity', 'Price']],
        body: itemRows,
        startY: 70 + index * 60, // Adjust Y position to avoid overlapping
      });
    });

    doc.save(`Invoices_${selectedCustomer || 'All_Customers'}.pdf`); // Save the consolidated PDF
  };

  return (
    <div className="list-container">
      <Sidebar /> {/* Include the Sidebar here */}
      <div className="list-content"> {/* Wrap the main content */}
        <h2 style={{ textAlign: 'center' }}>Invoice List</h2>

        {/* Dropdown to select a customer */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <select 
            value={selectedCustomer} 
            onChange={(e) => setSelectedCustomer(e.target.value)} 
            style={{ padding: '8px', width: '300px' }}
          >
            <option value="">Select Customer</option>
            {uniqueCustomers.map(customer => (
              <option key={customer} value={customer}>
                {customer}
              </option>
            ))}
          </select>
        </div>

        {/* Table to display filtered invoices */}
        <div className="list-table-container" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}> 
          {filteredInvoices.length === 0 ? (
            <p>No invoices available for the selected customer.</p>
          ) : (
            <>
              <div className="list-table-format title">
                <div>Invoice Number</div>
                <div>Customer Name</div>
                <div>Items</div>
                <div>Discount</div>
                <div>Total Amount</div>
                <div>Date</div> {/* Add a Date column */}
              </div>
              {filteredInvoices.map((invoice) => (
                <div className="list-table-format" key={invoice._id}>
                  <div>{invoice.invoiceNumber}</div>
                  <div>{invoice.customerName}</div>
                  <div>
                    <ul>
                      {invoice.items.map((item, index) => (
                        <li key={index}>
                          {item.name} (Quantity: {item.quantity}, Price: {item.price})
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>{invoice.discount}</div>
                  <div>{invoice.totalAmount}</div>
                  <div>{formatDate(invoice.createdAt)}</div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Button to generate a consolidated PDF */}
        {filteredInvoices.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className="generate-pdf-button" onClick={generatePDFForCustomer}>Generate PDF for {selectedCustomer || 'All Customers'}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDisplay;
