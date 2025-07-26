import React from 'react';

const Loader: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
    {message && <p className="text-gray-600 mt-2">{message}</p>}
  </div>
);

export default Loader; 