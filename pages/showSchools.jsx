// pages/showSchools.jsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Modal component for displaying school details
const SchoolModal = ({ school, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative h-64 w-full bg-gray-100">
          {school.image ? (
            <Image 
              src={school.image} 
              alt={`${school.name} image`} 
              layout="fill" 
              objectFit="cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <span className="text-gray-400">No Image Available</span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-4">{school.name}</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Location Details</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Address:</span><br />
                    {school.address}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">City:</span> {school.city}
                  </p>
                  {school.state && (
                    <p className="text-gray-600">
                      <span className="font-medium">State:</span> {school.state}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {school.contact && (
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span> {school.contact}
                    </p>
                  )}
                  {school.email_id && (
                    <p className="text-gray-600 break-words">
                      <span className="font-medium">Email:</span> {school.email_id}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* School Details Section */}
            {(school.type || school.principal_name || school.details) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">School Details</h3>
                <div className="space-y-3">
                  {school.type && (
                    <p className="text-gray-600">
                      <span className="font-medium">Type:</span> {school.type}
                    </p>
                  )}
                  {school.principal_name && (
                    <p className="text-gray-600">
                      <span className="font-medium">Principal:</span> {school.principal_name}
                    </p>
                  )}
                  {school.details && (
                    <div>
                      <span className="font-medium text-gray-600">About:</span>
                      <p className="text-gray-600 mt-1 whitespace-pre-line">{school.details}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Facilities Section */}
            {school.facilities && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Facilities</h3>
                <p className="text-gray-600 whitespace-pre-line">{school.facilities}</p>
              </div>
            )}

            {/* Achievements Section */}
            {school.achievements && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Achievements</h3>
                <p className="text-gray-600 whitespace-pre-line">{school.achievements}</p>
              </div>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Component for a single school card
const SchoolCard = ({ school, onClick }) => {
  return (
    // Card styling: Border, shadow, rounded, and smooth hover transition
    <div 
      onClick={onClick}
      className="border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] bg-white cursor-pointer">
      
      {/* Image Container: Fixed height for uniform card size */}
      <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
        {school.image ? (
            // Image component requires the image path to be valid (fetched from public/schoolImages)
            <Image 
                src={school.image} 
                alt={`${school.name} image`} 
                layout="fill" 
                objectFit="cover" // Ensures image covers the area without distorting
            />
        ) : (
            <span className="text-gray-400">No Image Available</span>
        )}
      </div>

      <div className="p-5">
        {/* School Name */}
        <h3 className="text-xl font-bold mb-2 text-gray-900 truncate">
          {school.name}
        </h3>
        
        {/* Brief Location */}
        <div className="flex items-start text-sm text-gray-500 mb-2">
  <svg
    className="w-4 h-4 mr-1 mt-1 text-indigo-500 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    ></path>
  </svg>

  <div className="flex flex-col">
    <p className="font-medium text-gray-600">{school.address}</p>
    <p className="font-medium text-gray-600">{school.city}</p>
  </div>
</div>

        
        {/* View More Hint */}
        <p className="text-sm text-indigo-600 mt-2 flex items-center">
          {/* <span>Click to view details</span> */}
          {/* <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg> */}
        </p>
      </div>
    </div>
  );
};

const ShowSchools = () => {
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/schools');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setSchools(data);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Could not load schools data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchools();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      
      {/* Header: Centered, prominent title, and CTA link */}
      <header className="py-8 text-center border-b border-gray-200 mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">School Listings Directory</h1>
        <p className="text-lg text-gray-600">Browse the schools in our database.</p>
        <a href="/addSchool" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-300 shadow-md">
            + Add New School
        </a>
      </header>
      
      {isLoading && <div className="text-center p-8 text-indigo-600 font-medium">Loading schools...</div>}
      {error && <div className="text-center p-8 text-red-600 font-medium">{error}</div>}

      {!isLoading && schools.length === 0 && (
        <p className="text-center text-xl text-gray-500 p-10">No schools found. Use the 'Add New School' button to get started!</p>
      )}

      {/* Responsive Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {schools.map((school, index) => (
          <SchoolCard 
            key={index} 
            school={school} 
            onClick={() => setSelectedSchool(school)}
          />
        ))}
      </div>

      <SchoolModal 
        school={selectedSchool}
        isOpen={selectedSchool !== null}
        onClose={() => setSelectedSchool(null)}
      />
    </div>
  );
};

export default ShowSchools;