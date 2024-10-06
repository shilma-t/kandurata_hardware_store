import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import toast, { Toaster } from "react-hot-toast";
import './HRManagerQueries.css';

const HrManagerDashboard = () => {
  const [queries, setQueries] = useState([]);
  const [replies, setReplies] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Add search state

  // Fetch the inquiries and replies from the backend
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axios.get("http://localhost:5001/inquiries");
        setQueries(response.data.inquiries || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      }
    };

    const fetchReplies = async () => {
      try {
        const response = await axios.get("http://localhost:5001/replies");
        setReplies(response.data.replies || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    };

    fetchQueries();
    fetchReplies();
  }, []);

  // Find reply for a given inquiry ID
  const findReplyForInquiry = (inquiryId) => {
    return replies.find((reply) => reply.inquiryId === inquiryId);
  };

  // Delete an inquiry by ID
  const deleteInquiry = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/inquiries/${id}`);
      setQueries(queries.filter((query) => query._id !== id));
      toast.success("Inquiry deleted successfully");
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error("Failed to delete inquiry");
    }
  };

  // Filter queries based on search input
  const filteredQueries = queries.filter((query) => {
    const reply = findReplyForInquiry(query._id);
    return (
      query.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reply && reply.replyMessage.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Generate PDF report
  const generateReport = () => {
    const doc = new jsPDF();
    doc.text("Inquiries and Replies Report", 10, 10);

    // Create a combined table with inquiries and replies
    const tableData = filteredQueries.map((query) => {
      const reply = findReplyForInquiry(query._id);
      return [
        query.username,
        query.email,
        query.message,
        reply ? reply.replyMessage : "No reply"
      ];
    });

    // Table with username, email, message, and reply
    doc.autoTable({
      startY: 20,
      head: [["Username", "Email", "Message", "Reply"]],
      body: tableData,
    });

    doc.save("inquiries_and_replies_report.pdf");
  };

  return (
    <div className="container">
      <h1>HR Manager Dashboard</h1>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search inquiries..."
        className="search-box"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button className="generate-report-btn" onClick={generateReport}>
        Generate Report
      </button>
      
      <h2>Inquiries and Replies</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Message</th>
            <th>Reply</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredQueries.map((query) => {
            const reply = findReplyForInquiry(query._id); // Get the reply for each inquiry
            return (
              <tr key={query._id}>
                <td>{query.username}</td>
                <td>{query.email}</td>
                <td>{query.message}</td>
                <td>{reply ? reply.replyMessage : "No reply"}</td>
                <td className="actions">
                  {!reply && <Link to={`/reply/${query._id}`}>
                    <button>Reply</button>
                  </Link>}
                  {!reply && <button onClick={() => deleteInquiry(query._id)}>Deny</button>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Toaster />
    </div>
  );
};

export default HrManagerDashboard;
