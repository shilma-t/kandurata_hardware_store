import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import UpdateModal from './UpdateModal'; // Adjust path as necessary
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { confirmAlert } from 'react-confirm-alert'; // Import confirmAlert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS
import './List.css'; // Import the CSS file
import Sidebar from '../../components/Sidebar/Sidebar'; // Import the Sidebar component

const List = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [suppliers, setSuppliers] = useState([]); // State for suppliers
  const [selectedSupplier, setSelectedSupplier] = useState(''); // State for selected supplier

  const url = "http://localhost:5001/api/product";

  // Fetch products from the server
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${url}/list`);
      if (response.data.success) {
        setProducts(response.data.data);
        const uniqueSuppliers = Array.from(new Set(response.data.data.map(product => product.supplierName)));
        setSuppliers(uniqueSuppliers);
      } else {
        toast.error("Error fetching products");
      }
    } catch (error) {
      toast.error("Network Error");
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    fetchProducts(); // Refresh the product list after update
    toast.success("Product updated successfully!"); // Toast message after update
  };

  const handleDelete = async (id) => {
    console.log("Delete function triggered");
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this product?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const response = await axios.post(`${url}/remove`, { id });
              if (response.data.success) {
                toast.success("Product removed successfully!"); // Toast message after deletion
                fetchProducts(); // Refresh the product list after deletion
              } else {
                toast.error("Error removing product");
              }
            } catch (error) {
              toast.error("Network Error");
              console.error("Error removing product:", error);
            }
          }
        },
        {
          label: 'No',
          onClick: () => console.log('Deletion cancelled')
        }
      ]
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Product List by Supplier", 14, 16);
    const filteredBySupplier = products.filter(product => product.supplierName === selectedSupplier);
    
    autoTable(doc, {
      head: [['Name', 'Description', 'Wholesale Price', 'Retail Price', 'Quantity', 'Category', 'Date']],
      body: filteredBySupplier.map(product => [
        product.name,
        product.description,
        product.wholesalePrice,
        product.retailPrice,
        product.quantity,
        product.category,
        new Date(product.date).toLocaleDateString()
      ])
    });

    if (filteredBySupplier.length > 0) {
      doc.save(`${selectedSupplier}-product-list.pdf`);
    } else {
      toast.error("No products found for the selected supplier");
    }
  };

  const generateCSV = () => {
    const csv = Papa.unparse(products, {
      fields: ['name', 'description', 'wholesalePrice', 'retailPrice', 'quantity', 'category', 'supplierName', 'date']
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'product-list.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-container">
      <Sidebar /> {/* Sidebar takes some width */}
      
      <div className="product-list-container"> {/* The product list will adjust next to Sidebar */}
        <h2>Product List</h2>
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <div className="supplier-selection">
          <label htmlFor="supplier">Select Supplier:</label>
          <select
            id="supplier"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
          >
            <option value="">All Suppliers</option>
            {suppliers.map(supplier => (
              <option key={supplier} value={supplier}>{supplier}</option>
            ))}
          </select>
        </div>

        <div className="actions">
          <button onClick={generatePDF}>Download PDF</button>
          <button onClick={generateCSV}>Download CSV</button>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Wholesale Price</th>
              <th>Retail Price</th>
              <th>Quantity</th>
              <th>Category</th>
              <th>Supplier Name</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.wholesalePrice}</td>
                <td>{product.retailPrice}</td>
                <td>{product.quantity}</td>
                <td>{product.category}</td>
                <td>{product.supplierName}</td>
                <td>{new Date(product.date).toLocaleDateString()}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button onClick={() => handleDelete(product._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Update Modal */}
        <UpdateModal 
          isOpen={isModalOpen} 
          onRequestClose={() => setIsModalOpen(false)} 
          product={selectedProduct} 
          onUpdate={handleUpdate} 
        />
      </div>
    </div>
  );
};

export default List;
