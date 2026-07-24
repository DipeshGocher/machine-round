import React, { useEffect, useState } from 'react';
import { getAdminProducts } from '../../services/adminService.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import SearchBar from '../../components/SearchBar.jsx';
import { Utensils, AlertCircle, Store, Tag, DollarSign } from 'lucide-react';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const fetchProductsCatalog = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getAdminProducts();
      if (res?.success) {
        setProducts(res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load system products catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsCatalog();
  }, []);

  const categories = ['All', 'Pizza', 'Burger', 'Beverages', 'Dessert', 'Other'];

  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.franchise?.name && p.franchise.name.toLowerCase().includes(query));

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LoadingSpinner message="Fetching global products catalog..." />;
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
            <h2>Global Product Catalog</h2>
            <span className="badge badge-neutral">Read Only</span>
          </div>
          <p>Overview of all food products and menu items across all active franchises</p>
        </div>
      </div>

      {error && (
        <div className="card empty-state" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={40} className="text-danger empty-state-icon" />
          <p>{error}</p>
          <button className="btn btn-secondary btn-sm" onClick={fetchProductsCatalog} style={{ marginTop: '0.5rem' }}>
            Retry
          </button>
        </div>
      )}

      {/* Search and Category Filters */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div className="flex-between flex-wrap gap-2">
          <div style={{ flex: 1, minWidth: '250px' }}>
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, category, or franchise name..."
            />
          </div>

          <div className="flex-center gap-2">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Category:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.8rem' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <Utensils size={48} className="empty-state-icon" />
            <h3>No Products Found</h3>
            <p>No product records matched your search criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Franchise Location</th>
                  <th>Availability</th>
                  <th>Added Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>
                      <span className="badge badge-neutral flex-center gap-1" style={{ display: 'inline-flex' }}>
                        <Tag size={12} />
                        <span>{p.category}</span>
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      ${p.price ? p.price.toFixed(2) : '0.00'}
                    </td>
                    <td>
                      {p.franchise?.name ? (
                        <div className="flex-center gap-1" style={{ justifyContent: 'flex-start' }}>
                          <Store size={14} className="text-primary" />
                          <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{p.franchise.name}</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Unassigned</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${p.availability ? 'badge-success' : 'badge-danger'}`}>
                        {p.availability ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductList;
