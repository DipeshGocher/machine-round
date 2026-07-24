import React, { useState } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import FilterBar from '../components/FilterBar.jsx';
import Pagination from '../components/Pagination.jsx';
import { showToast } from '../utils/toast.js';

const Home = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filterOptions = [
    { label: 'All Items', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' }
  ];

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1>Welcome to MERN Boilerplate</h1>
        <p>Production-ready foundation with React, Vite, Express, and MongoDB.</p>
      </div>

      <div className="card">
        <h2>Reusable UI Playground</h2>
        <p style={{ marginBottom: '1.5rem' }}>Demonstrating pre-configured Search, Filters, and Pagination components.</p>

        <div className="flex-between gap-2" style={{ flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search items..."
          />

          <FilterBar
            options={filterOptions}
            selected={filter}
            onChange={setFilter}
          />
        </div>

        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius)' }}>
          <p>Current Search Query: <strong>{search || '(empty)'}</strong></p>
          <p>Selected Filter: <strong>{filter}</strong></p>
        </div>

        <div className="flex gap-1" style={{ marginTop: '1rem' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => showToast.success('Toast Notification Working!')}
          >
            Test Success Toast
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => showToast.error('Error Toast Working!')}
          >
            Test Error Toast
          </button>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default Home;
