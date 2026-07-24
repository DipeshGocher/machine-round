import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getProducts,
  deleteProduct,
  toggleProductAvailability
} from '../../services/franchiseOwnerService.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ConfirmationModal from '../../components/ConfirmationModal.jsx';
import SearchBar from '../../components/SearchBar.jsx';
import Pagination from '../../components/Pagination.jsx';
import { showToast } from '../../utils/toast.js';
import {
  Utensils,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  DollarSign
} from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [availability, setAvailability] = useState('All');
  const [sort, setSort] = useState('latest');

  // Confirmation Modal State (Delete)
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    product: null
  });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProductList = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getProducts({
        search,
        category,
        availability,
        sort,
        page,
        limit: 8
      });
      if (res?.success) {
        setProducts(res.data.products || []);
        setTotalProducts(res.data.totalProducts || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, [search, category, availability, sort, page]);

  const handleToggleAvailability = async (product) => {
    try {
      const newStatus = !product.availability;
      const res = await toggleProductAvailability(product._id, newStatus);
      if (res?.success) {
        showToast.success(`"${product.name}" marked as ${newStatus ? 'Available' : 'Out of Stock'}`);
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? { ...p, availability: newStatus } : p))
        );
      }
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to toggle availability');
    }
  };

  const openDeleteModal = (product) => {
    setDeleteModal({ isOpen: true, product });
  };

  const closeDeleteModal = () => {
    if (!actionLoading) {
      setDeleteModal({ isOpen: false, product: null });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.product) return;
    const { _id, name } = deleteModal.product;

    try {
      setActionLoading(true);
      const res = await deleteProduct(_id);
      if (res?.success) {
        showToast.success(`Product "${name}" deleted permanently`);
        fetchProductList();
      }
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setActionLoading(false);
      closeDeleteModal();
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>Product Catalog</h2>
          <p>Manage items, prices, categories, and stock availability for your franchise</p>
        </div>
        <Link to="/franchise/products/add" className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Product</span>
        </Link>
      </div>

      {error && (
        <div className="card empty-state" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={40} className="text-danger empty-state-icon" />
          <p>{error}</p>
          <button className="btn btn-secondary btn-sm" onClick={fetchProductList} style={{ marginTop: '0.5rem' }}>
            Retry
          </button>
        </div>
      )}

      {/* Filter and Control Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
        <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
          {/* Search */}
          <div style={{ gridColumn: 'span 1' }}>
            <SearchBar
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search product..."
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
              <option value="All">All Stock Statuses</option>
              <option value="true">Available Only</option>
              <option value="false">Out of Stock Only</option>
            </select>
          </div>

          {/* Sort Option */}
          <div>
            <select
              className="form-select"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="latest">Sort: Latest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {loading ? (
        <LoadingSpinner message="Fetching products catalog..." />
      ) : products.length === 0 ? (
        <div className="card empty-state">
          <Utensils size={48} className="empty-state-icon" />
          <h3>No Products Found</h3>
          <p>
            {search || category !== 'All' || availability !== 'All'
              ? 'No product matches your search and filter criteria.'
              : 'Add your first menu item to populate your franchise catalog.'}
          </p>
          {(!search && category === 'All' && availability === 'All') && (
            <Link to="/franchise/products/add" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              <Plus size={16} />
              <span>Add Product</span>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Availability</th>
                    <th>Created By</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
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
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div style={{ width: '40px', height: '40px', background: 'var(--bg-input)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Utensils size={18} className="text-muted" />
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 600 }}>{p.name}</div>
                            {p.description && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {p.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{p.category}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        ${p.price.toFixed(2)}
                      </td>
                      <td>
                        <button
                          className="btn-icon"
                          style={{ gap: '0.4rem', cursor: 'pointer' }}
                          onClick={() => handleToggleAvailability(p)}
                          title="Click to toggle availability"
                        >
                          {p.availability ? (
                            <ToggleRight size={26} className="text-success" />
                          ) : (
                            <ToggleLeft size={26} className="text-danger" />
                          )}
                          <span className={`badge ${p.availability ? 'badge-success' : 'badge-danger'}`}>
                            {p.availability ? 'Available' : 'Out of Stock'}
                          </span>
                        </button>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {p.createdBy?.name || 'Owner'}
                      </td>
                      <td>
                        <div className="flex-center gap-1" style={{ justifyContent: 'flex-end' }}>
                          <Link
                            to={`/franchise/products/edit/${p._id}`}
                            className="btn-icon"
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            className="btn-icon text-danger"
                            title="Delete Product"
                            onClick={() => openDeleteModal(p)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Product Permanently?"
        message={`Are you sure you want to delete "${deleteModal.product?.name}"? This action is permanent and cannot be undone.`}
        confirmText="Delete Product"
        confirmVariant="danger"
        isLoading={actionLoading}
        onConfirm={handleConfirmDelete}
        onClose={closeDeleteModal}
      />
    </div>
  );
};

export default ProductList;
