import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Truck, FileText, DollarSign } from "lucide-react";
import Sidebar from '../Sidebar';
import './Dashboard.css';

export default function Dashboard() {
  // State variables for fetched data
  const [toBeShippedCount, setToBeShippedCount] = useState(0);
  const [toBeDeliveredCount, setToBeDeliveredCount] = useState(0);
  const [quantityInHand, setQuantityInHand] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [topSellingItem, setTopSellingItem] = useState('');

  // Fetch data from APIs on component mount
  useEffect(() => {
    fetchToBeShipped();
    fetchToBeDelivered();
    fetchQuantityInHand();
    fetchLowStockItems();
    fetchTopSellingItem();
  }, []);

  // Function to fetch 'To Be Shipped' count
  const fetchToBeShipped = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/salesorder');
      const currentDate = new Date();

      // Filter based on the condition where the current date is less than the expectedShipmentDate
      const count = response.data.filter(order => new Date(order.expectedShipmentDate) > currentDate).length;
      setToBeShippedCount(count);
    } catch (error) {
      console.error('Error fetching To Be Shipped count:', error);
    }
  };

  // Function to fetch 'To Be Delivered' count
  const fetchToBeDelivered = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/salesorder');
      const currentDate = new Date();

      // Filter based on the condition where the expectedShipmentDate is earlier than the current date
      const count = response.data.filter(order => new Date(order.expectedShipmentDate) < currentDate).length;
      setToBeDeliveredCount(count);
    } catch (error) {
      console.error('Error fetching To Be Delivered count:', error);
    }
  };

  // Function to fetch 'Quantity in Hand' from product API
  const fetchQuantityInHand = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/product');
      console.log('Fetched products:', response.data); // Debugging log

      const totalQuantity = response.data.reduce((total, product) => total + product.openingStock, 0);
      setQuantityInHand(totalQuantity);
    } catch (error) {
      console.error('Error fetching Quantity in Hand:', error);
    }
  };

  // Function to fetch 'Low Stock Items' from product API
  const fetchLowStockItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/product');
      const lowStockCount = response.data.filter(product => product.openingStock <= product.reorderPoint).length;
      setLowStockItems(lowStockCount);
    } catch (error) {
      console.error('Error fetching Low Stock Items:', error);
    }
  };

  // Function to fetch 'Top Selling Item' from sales order API
  const fetchTopSellingItem = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/salesorder');
      const productSales = {};

      // Count the occurrences of each product sold in sales orders
      response.data.forEach(order => {
        order.items.forEach(item => {
          productSales[item.itemName] = (productSales[item.itemName] || 0) + item.quantity;
        });
      });

      // Find the product with the highest sales count
      const topProduct = Object.keys(productSales).reduce((a, b) => productSales[a] > productSales[b] ? a : b);
      setTopSellingItem(topProduct);
    } catch (error) {
      console.error('Error fetching Top Selling Item:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar/>
      <div className="grid-2-col">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Sales Activity</h2>
          </div>
          <div className="card-content">
            <div className="grid-4-col">
              <div className="stat-item">
                <span className="stat-number blue">51</span>
                <span className="stat-label">Qty</span>
                <div className="stat-detail">
                  <Package className="icon" />
                  TO BE PACKED
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-number red">{toBeShippedCount}</span>
                <span className="stat-label">Pkgs</span>
                <div className="stat-detail">
                  <Truck className="icon" />
                  TO BE SHIPPED
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-number green">{toBeDeliveredCount}</span>
                <span className="stat-label">Pkgs</span>
                <div className="stat-detail">
                  <Truck className="icon" />
                  TO BE DELIVERED
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-number yellow">97</span>
                <span className="stat-label">Qty</span>
                <div className="stat-detail">
                  <FileText className="icon" />
                  TO BE INVOICED
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Inventory Summary</h2>
          </div>
          <div className="card-content">
            <div className="inventory-summary">
              <div className="inventory-item">
                <span className="label">QUANTITY IN HAND</span>
                <span className="value">{quantityInHand}</span>
              </div>
              <div className="inventory-item">
                <span className="label">QUANTITY TO BE RECEIVED</span>
                <span className="value">62</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2-col">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Product Details</h2>
          </div>
          <div className="card-content">
            <div className="grid-2-col">
              <div>
                <div className="product-detail">
                  <span className="red-text">Low Stock Items</span>
                  <span className="value">{lowStockItems}</span>
                </div>
                <div className="product-detail">
                  <span className="label">All Item Groups</span>
                  <span className="value">34</span>
                </div>
                <div className="product-detail">
                  <span className="label">All Items</span>
                  <span className="value">129</span>
                </div>
              </div>
              <div className="progress-circle-container">
                <div className="progress-circle">
                  <div className="progress-inner-circle"></div>
                  <div className="progress-cover">
                    <span className="progress-text">78%</span>
                  </div>
                </div>
                <span className="label">Active Items</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Top Selling Items</h2>
            <select className="dropdown">
              <option>This Month</option>
            </select>
          </div>
          <div className="card-content">
            <div className="grid-3-col">
              <div className="product-item">
                <div className="icon-container">
                  <DollarSign className="icon-lg" />
                </div>
                <span className="product-name">{topSellingItem}</span>
                <span className="product-weight">Sold Quantity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
