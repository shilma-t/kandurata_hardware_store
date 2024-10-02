import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import UpdateModal from './UpdateModal';
import Sidebar from '../../components/Sidebar/Sidebar';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';

const List = () => {
  const url = "http://localhost:5001";
  const [list, setList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [suppliers, setSuppliers] = useState([]); // New state for suppliers
  const [selectedSupplier, setSelectedSupplier] = useState(""); // New state for selected supplier

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/product/list`);
      if (response.data.success) {
        setList(response.data.data);
        setFilteredProducts(response.data.data);
        // Extract unique suppliers for the dropdown
        const uniqueSuppliers = [...new Set(response.data.data.map(item => item.supplierName))];
        setSuppliers(uniqueSuppliers);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Network Error");
      console.error("Error fetching list:", error);
    }
  };

  const handleRemoveProduct = (prodID) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this product?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => removeProduct(prodID)
        },
        {
          label: 'No',
        }
      ],
    });
  };

  const removeProduct = async (prodID) => {
    try {
      const response = await axios.post(`${url}/api/product/remove`, { id: prodID });
      if (response.data.success) {
        setList(list.filter(item => item._id !== prodID));
        setFilteredProducts(filteredProducts.filter(item => item._id !== prodID));
        toast.success(response.data.message);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Network Error");
      console.error("Error removing product:", error);
    }
  };

  const handleUpdateProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    fetchList();
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchQuery(value);
    const filtered = list.filter(item => 
      item.supplierName && item.supplierName.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sorted = [...filteredProducts].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setSortConfig({ key, direction });
    setFilteredProducts(sorted);
  };

  const generatePDF = (supplierName) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Products Supplied by ${supplierName}`, 14, 22);
  
    // Filter products by selected supplier
    const data = filteredProducts
      .filter(item => item.supplierName === supplierName)
      .map(item => [item.name, item.quantity, item.date]);
  
    // Set headers
    const headers = ["Product Name", "Quantity", "Supplied Date"];
    let startY = 40; // Starting position for headers
    headers.forEach((header, index) => {
      doc.text(header, 14 + (index * 60), startY);
    });
  
    // Adding data to the PDF
    startY += 10; // Move down for data rows
    data.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        doc.text(cell.toString(), 14 + (cellIndex * 60), startY + (rowIndex * 10));
      });
    });
  
    doc.save(`supplier_products_report_${supplierName}.pdf`);
  };
  
  const csvHeaders = [
    { label: "Name", key: "name" },
    { label: "Description", key: "description" },
    { label: "Category", key: "category" },
    { label: "Wholesale Price", key: "wholesalePrice" },
    { label: "Retail Price", key: "retailPrice" },
    { label: "Quantity", key: "quantity" },
    { label: "Supplier Name", key: "supplierName" },
    { label: "Date", key: "date" },
  ];

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='dashboard'>
      <Sidebar />
      <div className='alist add flex-col'>
        <p>All Products List</p>

        <div className="search-and-report">
          <input 
            type="text" 
            placeholder="Search by supplier name..." 
            value={searchQuery}
            onChange={handleSearch} 
            className="search-bar"
          />
          
          <select 
            value={selectedSupplier} 
            onChange={(e) => setSelectedSupplier(e.target.value)} 
            className="supplier-dropdown"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((supplier, index) => (
              <option key={index} value={supplier}>{supplier}</option>
            ))}
          </select>
          
          <button onClick={() => generatePDF(selectedSupplier)} className="btn-report" disabled={!selectedSupplier}>
            Generate Supplier Report
          </button>
        </div>
        
        <div className="alist-table">
          <div className="alist-table-format title">
            <b onClick={() => handleSort('image')}>Image</b>
            <b onClick={() => handleSort('name')}>Name</b>
            <b onClick={() => handleSort('description')}>Description</b>
            <b onClick={() => handleSort('category')}>Category</b>
            <b onClick={() => handleSort('wholesalePrice')}>Wholesale Price</b>
            <b onClick={() => handleSort('retailPrice')}>Retail Price</b>
            <b onClick={() => handleSort('quantity')}>Quantity</b>
            <b onClick={() => handleSort('supplierName')}>Supplier Name</b>
            <b onClick={() => handleSort('date')}>Date</b>
            <b>Action</b>
          </div>
          
          {filteredProducts.map((item, index) => (
            <div key={index} className='alist-table-format'>
              <img src={`${url}/images/` + item.image} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.description || "No description"}</p>
              <p>{item.category || "No category"}</p>
              <p>{item.wholesalePrice || "No wholesale price"}</p>
              <p>{item.retailPrice || "No retail price"}</p>
              <p>{item.quantity || "No quantity"}</p>
              <p>{item.supplierName || "No supplier name"}</p>
              <p>{item.date || "No date"}</p>
              <div>
                <p onClick={() => handleUpdateProduct(item)} className='cursor'>Edit</p>
                <p onClick={() => handleRemoveProduct(item._id)} className='cursor'>Delete</p>
              </div>
            </div>
          ))}
        </div>

        <CSVLink 
          data={filteredProducts}
          headers={csvHeaders}
          filename={"supplier_products_report.csv"}
          className="btn-report"
          target="_blank"
        >
          Download CSV
        </CSVLink>
      </div>

      {isModalOpen && (
        <UpdateModal 
          isOpen={isModalOpen} 
          closeModal={closeModal} 
          selectedProduct={selectedProduct} 
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default List;
