import React, { useEffect, useState } from 'react';
import { getStaffProducts, toggleStaffProductAvailability } from '../../services/staffService.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import SearchBar from '../../components/SearchBar.jsx';
import Pagination from '../../components/Pagination.jsx';
import { showToast } from '../../utils/toast.js';
import {
  Utensils,
  ToggleLeft,
  ToggleRight,
  AlertCircle
} from 'lucide-react';

const StaffProductList = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toggleLoadingId, setToggleLoadingId] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [availability, setAvailability] = useState('All');

  const fetchStaffProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getStaffProducts({
        search,
        category,
        availability,
        page,
        limit: 8
      });
      if (res?.success) {
        setProducts(res.data.products || []);
        setTotalProducts(res.data.totalProducts || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch franchise product inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffProducts();
  }, [search, category, availability, page]);

  const handleToggleAvailability = async (product) => {
    try {
      setToggleLoadingId(product._id);
      const newStatus = !product.availability;
      const res = await toggleStaffProductAvailability(product._id, newStatus);
      if (res?.success) {
        showToast.success(`"${product.name}" is now marked as ${newStatus ? 'Available' : 'Out of Stock'}`);
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? { ...p, availability: newStatus } : p))
        );
      }
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to update stock availability');
    } finally {
      setToggleLoadingId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Inventory Catalog</h2>
        <p>View franchise menu items and update live stock availability status</p>
      </div>

      {error && (
        <div className="card empty-state" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={40} className="text-danger empty-state-icon" />
          <p>{error}</p>
          <button className="btn btn-secondary btn-sm" onClick={fetchStaffProducts} style={{ marginTop: '0.5rem' }}>
            Retry
          </button>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
        <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
          {/* Search Bar */}
          <div>
            <SearchBar
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search product name..."
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              className="form-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">All Categories</option>
              <option value="Pizza">Pizza</option>
              <option value="Burger">Burger</option>
              <option value="Beverages">Beverages</option>
              <option value="Dessert">Dessert</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <select
              className="form-select"
              value={availability}
              onChange={(e) => {
                setAvailability(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">All Availability Statuses</option>
              <option value="true">Available Only</option>
              <option value="false">Out of Stock Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <LoadingSpinner message="Fetching inventory..." />
      ) : products.length === 0 ? (
        <div className="card empty-state">
          <Utensils size={48} className="empty-state-icon" />
          <h3>No Products Found</h3>
          <p>
            {search || category !== 'All' || availability !== 'All'
              ? 'No items match your search or filter criteria.'
              : 'No products registered in this franchise.'}
          </p>
        </div>
      ) : (
        <>
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Stock Status</th>
                    <th style={{ textAlign: 'right' }}>Toggle Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div style={{ width: '42px', height: '42px', background: 'var(--bg-input)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Utensils size={18} className="text-muted" />
                            </div>
                          )}
                          <span style={{ fontWeight: 600 }}>{p.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{p.category}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '240px' }}>
                        {p.description || 'N/A'}
                      </td>
                      <td>
                        <span className={`badge ${p.availability ? 'badge-success' : 'badge-danger'}`}>
                          {p.availability ? 'Available' : 'Out of Stock'}
                        </span>
                      </td>
                      <td>
                        <div className="flex-center" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-secondary btn-sm flex-center gap-1"
                            disabled={toggleLoadingId === p._id}
                            onClick={() => handleToggleAvailability(p)}
                            title="Toggle product stock availability"
                          >
                            {p.availability ? (
                              <ToggleRight size={22} className="text-success" />
                            ) : (
                              <ToggleLeft size={22} className="text-danger" />
                            )}
                            <span>{p.availability ? 'Mark Out of Stock' : 'Mark Available'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card" style={{ padding: '0.75rem 1.5rem' }}>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StaffProductList;
