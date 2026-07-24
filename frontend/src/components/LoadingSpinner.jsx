import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 24, fullPage = false, message = 'Loading...' }) => {
  const spinnerContent = (
    <div className="flex-center flex-column gap-1" style={{ padding: '1rem' }}>
      <Loader2 size={size} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
      {message && <p style={{ fontSize: '0.85rem' }}>{message}</p>}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh', width: '100%' }}>
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;
