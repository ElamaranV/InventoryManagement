import React, { useState, useEffect } from 'react';
import './SalesOrder.css';
import Sidebar from '../Sidebar';
import axios from 'axios';

const SalesOrder = () => {
  const [formData, setFormData] = useState({
    salesOrderNumber: '',
    customer: '',
    reference: '',
    salesOrderDate: '',
    expectedShipmentDate: '',
    paymentTerms: 'Due on Receipt',
    deliveryMethod: '',
    salesperson: '',
    priceList: '',
    items: [],
    shippingCharges: 0,
    adjustment: 0,
    termsAndConditions: '',
    attachments: [],
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
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [name]: value };

    const quantity = parseFloat(newItems[index].quantity) || 0;
    const rate = parseFloat(newItems[index].rate) || 0;
    const discount = parseFloat(newItems[index].discount) || 0;
    const amount = (quantity * rate) - (quantity * rate * (discount / 100));
    newItems[index].amount = amount.toFixed(2);
    setFormData({ ...formData, items: newItems });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemName: '', quantity: 1, rate: 0, discount: 0, amount: 0 }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = new FormData();

    // Append all form fields to FormData
    Object.keys(formData).forEach(key => {
      if (key === 'items') {
        dataToSubmit.append(key, JSON.stringify(formData[key]));
      } else if (key === 'attachments') {
        formData[key].forEach(file => {
          dataToSubmit.append('attachments', file);
        });
      } else if (key === 'shippingCharges' || key === 'adjustment') {
        dataToSubmit.append(key, parseFloat(formData[key]));
      } else {
        dataToSubmit.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post('http://localhost:5000/api/salesorder', dataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data); // Log the response for debugging
      alert(`Sales Order ${response.data.salesOrderNumber} created successfully!`);
      // Reset form
      setFormData({
        salesOrderNumber: '',
        customer: '',
        reference: '',
        salesOrderDate: '',
        expectedShipmentDate: '',
        paymentTerms: 'Due on Receipt',
        deliveryMethod: '',
        salesperson: '',
        priceList: '',
        items: [],
        shippingCharges: 0,
        adjustment: 0,
        termsAndConditions: '',
        attachments: [],
      });
    } catch (error) {
      console.error('There was an error creating the sales order!', error.response?.data || error.message);
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
          <label htmlFor="salesOrderNumber">Sales Order#*</label>
          <input 
            type="text" 
            id="salesOrderNumber" 
            value={formData.salesOrderNumber} 
            onChange={handleInputChange}
            required 
          />
        </div>

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
            <label htmlFor="expectedShipmentDate">Expected Shipment Date</label>
            <input type="date" id="expectedShipmentDate" value={formData.expectedShipmentDate} onChange={handleInputChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="paymentTerms">Payment Terms</label>
            <select id="paymentTerms" value={formData.paymentTerms} onChange={handleInputChange}>
              <option value="Due on Receipt">Due on Receipt</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 60">Net 60</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="deliveryMethod">Delivery Method</label>
            <input type="text" id="deliveryMethod" value={formData.deliveryMethod} onChange={handleInputChange} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="salesperson">Salesperson</label>
          <input type="text" id="salesperson" value={formData.salesperson} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="priceList">Select Price List</label>
          <input type="text" id="priceList" value={formData.priceList} onChange={handleInputChange} />
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
              {formData.items.map((item, index) => (
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
          <input type="number" id="adjustment" value={formData.adjustment} onChange={handleInputChange} step="0.01" />
        </div>

        <div className="form-group">
          <label htmlFor="termsAndConditions">Terms & Conditions</label>
          <textarea id="termsAndConditions" value={formData.termsAndConditions} onChange={handleInputChange}></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="attachments">Attach Files</label>
          <input 
            type="file" 
            id="attachments" 
            onChange={(e) => setFormData({ ...formData, attachments: Array.from(e.target.files) })} 
            multiple 
          />
        </div>

        <button type="submit">Create Sales Order</button>
      </form>
    </div>
  );
};

export default SalesOrder;