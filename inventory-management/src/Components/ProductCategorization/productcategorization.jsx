import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import './product-categorization.css';

const ProductCategorization = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    // Simulated API call to fetch categories
    const fetchCategories = async () => {
      // This would be replaced with an actual API call
      const sampleCategories = [
        { id: 1, name: 'Electronics', productCount: 120 },
        { id: 2, name: 'Clothing', productCount: 85 },
        { id: 3, name: 'Books', productCount: 200 },
      ];
      setCategories(sampleCategories);
    };

    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newId = categories.length + 1;
      setCategories([...categories, { id: newId, name: newCategory, productCount: 0 }]);
      setNewCategory('');
    }
  };

  const handleEditCategory = (id, newName) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, name: newName } : cat
    ));
    setEditingId(null);
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  return (
    <div className="product-categorization-container">
      <Sidebar />
      <div className="product-categorization-content">
        <h1 className="page-title">Product Categories</h1>
        
        <div className="add-category-section">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="new-category-input"
          />
          <button onClick={handleAddCategory} className="add-category-button">
            <FaPlus /> Add Category
          </button>
        </div>

        <div className="categories-list">
          {categories.map(category => (
            <div key={category.id} className="category-item">
              {editingId === category.id ? (
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => handleEditCategory(category.id, e.target.value)}
                  onBlur={() => setEditingId(null)}
                  autoFocus
                  className="edit-category-input"
                />
              ) : (
                <span className="category-name">{category.name}</span>
              )}
              <span className="product-count">({category.productCount} products)</span>
              <div className="category-actions">
                <button onClick={() => setEditingId(category.id)} className="action-button edit">
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteCategory(category.id)} className="action-button delete">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductCategorization;