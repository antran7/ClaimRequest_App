import React from 'react';

const ServicePage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex bg-pink-600 rounded-lg shadow-lg max-w-4xl p-6">
        <div className="flex-1 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">Lorem Ipsum text</h1>
          <p className="mb-4">
            Sum des text lorem ipsum text here
          </p>
          <button className="bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800">
            Contact now
          </button>
        </div>
        <div className="flex-1">
          <img
            src="https://via.placeholder.com/300" // Use actual image URL here
            alt="Illustration"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ServicePage;