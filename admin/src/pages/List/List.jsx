import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import UpdateModal from './UpdateModal';

const List = () => {
  const url = "http://localhost:5001";
  const [list, setList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/product/list`);
      if (response.data.success) {
        setList(response.data.data);
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

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Products List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Category</b>
          <b>Wholesale Price</b>
          <b>Retail Price</b>
          <b>Quantity</b>
          <b>Supplier Name</b>
          <b>Date</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
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
              <p onClick={() => handleRemoveProduct(item._id)} className='cursor'>X</p>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      {isModalOpen && (
        <UpdateModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          product={selectedProduct}
          onUpdate={fetchList}
        />
      )}
    </div>
  );
}

export default List;
