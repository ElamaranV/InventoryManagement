import React, { useState, useEffect } from 'react';
import './SalesOrder.css';
import Sidebar from '../Sidebar';
import axios from 'axios';

const SalesOrder = () => {
  const [formData, setFormData] = useState({
    customer: '',
    reference: '',
    salesOrderDate: '',
    expectedShipment: '',
    paymentTerms: 'Due on Receipt',
    deliveryMethod: '',
    salesperson: '',
    priceList: '',
    itemDetails: [{ itemName: '', quantity: 1, rate: 0, discount: 0, amount: 0 }],
    shippingCharges: 0,
    adjustment: 0,
    terms: '',
    files: [],
    salesOrder: '',  // Store the sales order number, now editable
  });

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Failed to fetch customers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItemDetails = [...formData.itemDetails];
    newItemDetails[index][name] = value;

    const quantity = parseFloat(newItemDetails[index].quantity) || 0;
    const rate = parseFloat(newItemDetails[index].rate) || 0;
    const discount = parseFloat(newItemDetails[index].discount) || 0;
    const amount = (quantity * rate) - (quantity * rate * (discount / 100));
    newItemDetails[index].amount = amount.toFixed(2);
    setFormData({ ...formData, itemDetails: newItemDetails });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      itemDetails: [...formData.itemDetails, { itemName: '', quantity: 1, rate: 0, discount: 0, amount: 0 }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object for file uploads
    const dataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'files') {
        Array.from(formData.files).forEach(file => {
          dataToSubmit.append(key, file);
        });
      } else {
        dataToSubmit.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post('http://localhost:5000/api/salesorders', dataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Use the provided sales order number instead of response data
      alert(`Sales Order ${formData.salesOrder} created successfully!`);
      // Reset form without salesOrder
      setFormData({
        customer: '',
        reference: '',
        salesOrderDate: '',
        expectedShipment: '',
        paymentTerms: 'Due on Receipt',
        deliveryMethod: '',
        salesperson: '',
        priceList: '',
        itemDetails: [{ itemName: '', quantity: 1, rate: 0, discount: 0, amount: 0 }],
        shippingCharges: 0,
        adjustment: 0,
        terms: '',
        files: [],
        salesOrder: '', // Reset sales order number
      });
    } catch (error) {
      console.error('There was an error creating the sales order!', error);
      alert('Failed to create sales order. Please try again.');
    }
  };

  return (
    <div className="sales-order">
      <Sidebar />
      <h1>New Sales Order</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="customer">Customer Name*</label>
          <div className="select-wrapper">
            {loading ? (
              <p>Loading customers...</p>
            ) : (
              <select id="customer" value={formData.customer} onChange={handleInputChange} required>
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.displayName || `${customer.firstName} ${customer.lastName}`}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="salesOrder">Sales Order#*</label>
            <input 
              type="text" 
              id="salesOrder" 
              value={formData.salesOrder} 
              onChange={handleInputChange} // Allow user to input sales order number
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="reference">Reference#</label>
            <input type="text" id="reference" value={formData.reference} onChange={handleInputChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="salesOrderDate">Sales Order Date*</label>
            <input type="date" id="salesOrderDate" value={formData.salesOrderDate} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="expectedShipment">Expected Shipment Date</label>
            <input type="date" id="expectedShipment" value={formData.expectedShipment} onChange={handleInputChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="paymentTerms">Payment Terms</label>
            <select id="paymentTerms" value={formData.paymentTerms} onChange={handleInputChange}>
              <option value="Due on Receipt">Due on Receipt</option>
              {/* Add other payment terms as needed */}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="deliveryMethod">Delivery Method</label>
            <select id="deliveryMethod" value={formData.deliveryMethod} onChange={handleInputChange}>
              <option value="">Select a delivery method or type to add</option>
              {/* Populate delivery methods from your database */}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="salesperson">Salesperson</label>
          <select id="salesperson" value={formData.salesperson} onChange={handleInputChange}>
            <option value="">Select or Add Salesperson</option>
            {/* Populate salespersons from your database */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priceList">Select Price List</label>
          <select id="priceList" value={formData.priceList} onChange={handleInputChange}>
            <option value="">Select Price List</option>
            {/* Populate price lists from your database */}
          </select>
        </div>

        <div className="item-table">
          <h2>Item Table <span className="bulk-actions">Bulk Actions</span></h2>
          <table>
            <thead>
              <tr>
                <th>ITEM DETAILS</th>
                <th>QUANTITY</th>
                <th>RATE</th>
                <th>DISCOUNT %</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {formData.itemDetails.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input type="text" name="itemName" value={item.itemName} onChange={(e) => handleItemChange(index, e)} required />
                  </td>
                  <td>
                    <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} min="1" required />
                  </td>
                  <td>
                    <input type="number" name="rate" value={item.rate} onChange={(e) => handleItemChange(index, e)} min="0" step="0.01" required />
                  </td>
                  <td>
                    <input type="number" name="discount" value={item.discount} onChange={(e) => handleItemChange(index, e)} min="0" max="100" step="0.01" />
                  </td>
                  <td>{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addItemRow}>Add Item</button>
        </div>

        <div className="form-group">
          <label htmlFor="shippingCharges">Shipping Charges</label>
          <input type="number" id="shippingCharges" value={formData.shippingCharges} onChange={handleInputChange} min="0" step="0.01" />
        </div>

        <div className="form-group">
          <label htmlFor="adjustment">Adjustment</label>
          <input type="number" id="adjustment" value={formData.adjustment} onChange={handleInputChange} min="0" step="0.01" />
        </div>

        <div className="form-group">
          <label htmlFor="terms">Terms</label>
          <textarea id="terms" value={formData.terms} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="files">Upload Files</label>
          <input type="file" id="files" multiple onChange={(e) => setFormData({ ...formData, files: e.target.files })} />
        </div>

        <button type="submit">Create Sales Order</button>
      </form>
    </div>
  );
};

export default SalesOrder;
