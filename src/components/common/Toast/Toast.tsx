import React from 'react';
import { Toaster } from 'react-hot-toast';
import type { ReactNode } from 'react';

function Toast(): ReactNode {
  return (
    <Toaster
      position="top-center"
      gutter={12}
      containerStyle={{ margin: '30px' }}
      toastOptions={{
        success: {
          duration: 3000,
        },
        error: {
          duration: 5000,
        },
        style: {
          fontSize: '16px',
          maxWidth: '500px',
          padding: '16px 24px',
          backgroundColor: '#f3f4f6',
          color: '#374151',
        },
      }}
    />
  );
}

export default React.memo(Toast);
