import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex-between gap-1" style={{ marginTop: '1.5rem', flexWrap: 'wrap' }}>
      <p style={{ fontSize: '0.85rem' }}>
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </p>

      <div className="flex gap-1">
        <button
          className="btn btn-secondary btn-sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} /> Prev
        </button>

        <button
          className="btn btn-secondary btn-sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
