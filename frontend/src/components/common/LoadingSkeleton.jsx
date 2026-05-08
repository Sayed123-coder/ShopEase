const LoadingSkeleton = ({ type = 'product' }) => {
  if (type === 'product') {
    return (
      <div className="card p-4 animate-pulse">
        <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="bg-white rounded-lg p-4 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingSkeleton;
