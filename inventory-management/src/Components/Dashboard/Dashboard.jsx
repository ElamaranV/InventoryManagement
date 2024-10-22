import React, { useEffect, useState , } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Package, Truck, FileText, DollarSign } from "lucide-react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from '../Sidebar';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [toBeShippedCount, setToBeShippedCount] = useState(0);
  const [toBeDeliveredCount, setToBeDeliveredCount] = useState(0);
  const [quantityInHand, setQuantityInHand] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [topSellingItem, setTopSellingItem] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProductStock, setSelectedProductStock] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchToBeShipped(),
        fetchToBeDelivered(),
        fetchProducts(),
        fetchSalesData(),
        fetchTopSellingItem()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      console.log('Fetched products:', response.data);
      setProducts(response.data);
      calculateQuantityInHand(response.data);
      calculateLowStockItems(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  const calculateQuantityInHand = (products) => {
    const totalQuantity = products.reduce((total, product) => {
      const stock = parseInt(product.openingStock) || 0;
      console.log(`Product: ${product.ProductTitle}, Stock: ${stock}`);
      return total + stock;
    }, 0);
    console.log('Total Quantity in Hand:', totalQuantity);
    setQuantityInHand(totalQuantity);
  };

  const calculateLowStockItems = (products) => {
    const lowStockCount = products.filter(product => {
      const stock = parseInt(product.openingStock) || 0;
      const reorderPoint = parseInt(product.reorderPoint) || 0;
      console.log(`Product: ${product.ProductTitle}, Stock: ${stock}, Reorder Point: ${reorderPoint}`);
      return stock <= reorderPoint;
    }).length;
    console.log('Low Stock Items Count:', lowStockCount);
    setLowStockItems(lowStockCount);
  };

  const fetchSalesData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/salesorder');
      const sales = response.data.map(order => ({
        date: new Date(order.salesOrderDate).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short'
        }),
        amount: order.totalAmount
      }));
      setSalesData(sales);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      throw error;
    }
  };

  const fetchToBeShipped = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/salesorder');
      const currentDate = new Date();
      const count = response.data.filter(order => new Date(order.expectedShipmentDate) > currentDate).length;
      setToBeShippedCount(count);
    } catch (error) {
      console.error('Error fetching To Be Shipped count:', error);
      throw error;
    }
  };

  const fetchToBeDelivered = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/salesorder');
      const currentDate = new Date();
      const count = response.data.filter(order => new Date(order.expectedShipmentDate) < currentDate).length;
      setToBeDeliveredCount(count);
    } catch (error) {
      console.error('Error fetching To Be Delivered count:', error);
      throw error;
    }
  };

  const fetchTopSellingItem = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/salesorder');
      const productSales = {};
      response.data.forEach(order => {
        order.items.forEach(item => {
          productSales[item.itemName] = (productSales[item.itemName] || 0) + item.quantity;
        });
      });
      const topProduct = Object.keys(productSales).reduce((a, b) => productSales[a] > productSales[b] ? a : b);
      setTopSellingItem(topProduct);
    } catch (error) {
      console.error('Error fetching Top Selling Item:', error);
      throw error;
    }
  };

  const handleProductChange = (e) => {
    const selectedId = e.target.value;
    setSelectedProductId(selectedId);
    if (selectedId) {
      const selectedProduct = products.find(product => product._id === selectedId);
      if (selectedProduct) {
        const stock = parseInt(selectedProduct.openingStock) || 0;
        console.log(`Selected Product: ${selectedProduct.ProductTitle}, Stock: ${stock}`);
        setSelectedProductStock(stock);
      }
    } else {
      setSelectedProductStock(0);
    }
  };

  const chartData = {
    labels: salesData.map(sale => sale.date),
    datasets: [
      {
        label: 'Sales Amount',
        data: salesData.map(sale => sale.amount),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Overview',
      },
    },
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
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
                  ORDERS PLACED
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-number red">{toBeShippedCount}</span>
                <span className="stat-label">Pkgs</span>
                <div className="stat-detail">
                  <Truck className="icon" />
                  PACKED
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-number green">{toBeDeliveredCount}</span>
                <span className="stat-label">Pkgs</span>
                <div className="stat-detail">
                  <Truck className="icon" />
                  SHIPPED
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-number yellow">97</span>
                <span className="stat-label">Qty</span>
                <div className="stat-detail">
                  <FileText className="icon" />
                  INVOICED
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
            <select 
              value={selectedProductId} 
              onChange={handleProductChange} 
              className="dropdown"
            >
              <option value="">Select a Product</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.productTitle}
                </option>
              ))}
            </select>

            {selectedProductId && (
              <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Available Products: {selectedProductStock}</p>
            )}

            <div className="inventory-summary">
              <div className="inventory-item">
                <span className="label"> TOTAL QUANTITY IN HAND</span>
                <span className="value">{quantityInHand}</span>
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
                  <span className="red-text">Low Stock Items : </span>
                  <Link to="/productdetails" className="link">
                    <span className="value">{lowStockItems}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Top Selling Items</h2>
          </div>
          {topSellingItem && (
            <h4> ** {topSellingItem}</h4> 
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Sales Chart</h2>
          </div>
          <div className="card-content">
            <Line data={chartData} options={chartOptions} className='line-chart'/>
          </div>
        </div>
      </div>
    </div>  
  );
}