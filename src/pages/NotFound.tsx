import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-2">Page not found</p>
      <Link to="/" className="text-blue-500 underline">
        Back to Home
      </Link>
    </div>
  );
}
