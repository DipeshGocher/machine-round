import React from 'react';
import { Filter } from 'lucide-react';

const FilterBar = ({ options = [], selected, onChange, label = 'Filter by' }) => {
  return (
    <div className="flex gap-1" style={{ alignItems: 'center' }}>
      <Filter size={16} style={{ color: 'var(--text-muted)' }} />
      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}:</span>
      <select
        className="form-select"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: 'auto', minWidth: '130px', padding: '0.4rem 0.8rem' }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
