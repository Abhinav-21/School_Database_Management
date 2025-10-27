// pages/addSchool.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// 1. Define the Validation Schema
const schema = yup.object().shape({
  name: yup.string().required('School name is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  contact: yup.string().matches(/^[0-9]+$/, "Contact must be a number").min(10, "Contact must be at least 10 digits").required('Contact is required'),
  email_id: yup.string().email('Must be a valid email').required('Email is required'),
  image: yup.mixed().required('School image is required'),
});

const AddSchool = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    
    // Log the received form data
    console.log('Form data received:', {
      ...data,
      image: data.image?.[0]?.name || 'No image'
    });
    
    // Append all text fields
    Object.keys(data).forEach(key => {
      if (key !== 'image') {
        console.log(`Appending ${key}:`, data[key]);
        formData.append(key, data[key]);
      }
    });
    
    // Append the file
    if (data.image && data.image.length > 0) {
      console.log('Appending image:', data.image[0].name);
      formData.append('image', data.image[0]);
    } else {
      console.warn('No image file selected');
    }
    
    // Log the FormData entries
    console.log('FormData contents:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1] instanceof File ? pair[1].name : pair[1]);
    }

    try {
      console.log('Submitting form data...');
      
      const response = await fetch('/api/schools', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type header as it's automatically set with FormData
          'Accept': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);
      alert('School added successfully!');
      reset();
      
    } catch (error) {
      console.error('Submission Error:', error);
      // Show more specific error message to the user
      alert(error.message || 'An unexpected error occurred during submission. Please check the console for more details.');
    }
  };

  return (
    // Aesthetic Styling: Centered card, modern background, max width for desktop
    <div className="min-h-screen flex justify-center items-start pt-10 pb-10 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Enroll New School</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Responsive Two-Column Layout for Name/Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="School Name" id="name" register={register} errors={errors} />
            <InputField label="Address" id="address" register={register} errors={errors} />
          </div>

          {/* City and State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="City" id="city" register={register} errors={errors} />
            <InputField label="State" id="state" register={register} errors={errors} />
          </div>

          {/* Contact and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Contact Number" id="contact" type="tel" register={register} errors={errors} />
            <InputField label="Email ID" id="email_id" type="email" register={register} errors={errors} />
          </div>

          {/* Image Input */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">School Image</label>
            <input id="image" type="file" accept="image/*" {...register('image')} className="mt-1 block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2" />
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
          </div>

          {/* Submission Button with Hover/Loading State */}
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold text-lg tracking-wider transition duration-300 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Add School to Database'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Reusable Input Field Component for Cleaner JSX
const InputField = ({ label, id, type = 'text', register, errors }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <input 
            id={id} 
            type={type} 
            {...register(id)} 
            className={`mt-1 block w-full border ${errors[id] ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150`}
        />
        {errors[id] && <p className="text-red-500 text-xs mt-1">{errors[id].message}</p>}
    </div>
);

export default AddSchool;