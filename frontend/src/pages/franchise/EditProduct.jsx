import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProducts, updateProduct } from '../../services/franchiseOwnerService.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { showToast } from '../../utils/toast.js';
import { validateUrl } from '../../utils/validators.js';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Pizza',
    price: '',
    description: '',
    imageUrl: '',
    availability: true
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setInitialLoading(true);
        const res = await getProducts({ page: 1, limit: 100 });
        if (res?.success) {
          const target = res.data.products.find((p) => p._id === id);
          if (target) {
            setFormData({
              name: target.name || '',
              category: target.category || 'Pizza',
              price: target.price || '',
              description: target.description || '',
              imageUrl: target.imageUrl || '',
              availability: target.availability !== undefined ? target.availability : true
            });
          } else {
            setFetchError('Product not found or access denied');
          }
        }
      } catch (err) {
        setFetchError(err.response?.data?.message || 'Failed to fetch product details');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 2 || formData.name.trim().length > 100) {
      newErrors.name = 'Product name must be between 2 and 100 characters';
    }

    const validCategories = ['Pizza', 'Burger', 'Beverages', 'Dessert', 'Other'];
    if (!formData.category || !validCategories.includes(formData.category)) {
      newErrors.category = 'Select a valid category';
    }

    const priceNum = Number(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'Price must be a positive number greater than zero';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    if (formData.imageUrl && !validateUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Enter a valid image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      const res = await updateProduct(id, formData);
      if (res?.success) {
        showToast.success('Product updated successfully!');
        navigate('/franchise/products');
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || 'Failed to update product';
      showToast.error(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner message="Loading product record..." />;
  }

  if (fetchError) {
    return (
      <div className="card empty-state" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <AlertCircle size={44} className="text-danger empty-state-icon" />
        <h3>Error Loading Product</h3>
        <p>{fetchError}</p>
        <Link to="/franchise/products" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Product Catalog
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/franchise/products" className="btn btn-secondary btn-sm flex-center gap-1" style={{ width: 'fit-content', marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Products Catalog</span>
        </Link>
        <h2>Edit Product</h2>
        <p>Update menu item details, pricing, or stock availability</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="grid grid-cols-2">
            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Pizza">Pizza</option>
                <option value="Burger">Burger</option>
                <option value="Beverages">Beverages</option>
                <option value="Dessert">Dessert</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <div className="form-error">{errors.category}</div>}
            </div>

            {/* Price */}
            <div className="form-group">
              <label className="form-label">Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                name="price"
                className="form-input"
                value={formData.price}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.price && <div className="form-error">{errors.price}</div>}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              name="description"
              className="form-input"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.description && <div className="form-error">{errors.description}</div>}
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label className="form-label">Image URL (Optional)</label>
            <input
              type="url"
              name="imageUrl"
              className="form-input"
              value={formData.imageUrl}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.imageUrl && <div className="form-error">{errors.imageUrl}</div>}
          </div>

          {/* Availability Checkbox */}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="flex-center gap-2" style={{ justifyContent: 'flex-start', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={handleChange}
                disabled={loading}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontWeight: 500 }}>Make product available for ordering</span>
            </label>
          </div>

          <div className="flex-between" style={{ marginTop: '2rem' }}>
            <Link to="/franchise/products" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span>Saving Changes...</span>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
