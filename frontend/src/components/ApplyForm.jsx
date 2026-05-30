import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const ApplyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    amount: '',
    purpose: '',
    language: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState(null);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile must be exactly 10 digits';
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
    if (!formData.language) newErrors.language = 'Language is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.post('/api/applications', formData);
      setSuccessId(response.data.id);
    } catch (err) {
      setApiError(err.response?.data?.error || 'An error occurred while submitting');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', mobile: '', amount: '', purpose: '', language: '' });
    setSuccessId(null);
    setErrors({});
    setApiError('');
  };

  if (successId) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Application Submitted!</h2>
        <p className="text-lg text-gray-700 mb-8">Your reference ID: <strong className="text-black">{successId}</strong></p>
        <div className="flex justify-center gap-4">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors" 
            onClick={resetForm}
          >
            Submit Another
          </button>
          <Link 
            to="/" 
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 border border-gray-300 rounded-md transition-colors decoration-none"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Loan Application</h2>
      
      {apiError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6 border border-red-200">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Name</label>
          <input 
            type="text" 
            name="name" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" 
            placeholder="Enter your full name" 
            value={formData.name} 
            onChange={handleChange} 
          />
          {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
          <input 
            type="text" 
            name="mobile" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" 
            placeholder="Enter 10-digit mobile number" 
            value={formData.mobile} 
            onChange={handleChange} 
            maxLength="10" 
          />
          {errors.mobile && <div className="text-red-600 text-sm mt-1">{errors.mobile}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (₹)</label>
          <input 
            type="number" 
            name="amount" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" 
            placeholder="Enter loan amount" 
            value={formData.amount} 
            onChange={handleChange} 
            min="1" 
          />
          {errors.amount && <div className="text-red-600 text-sm mt-1">{errors.amount}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loan Purpose</label>
          <input 
            type="text" 
            name="purpose" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" 
            placeholder="e.g. Home Renovation, Education" 
            value={formData.purpose} 
            onChange={handleChange} 
          />
          {errors.purpose && <div className="text-red-600 text-sm mt-1">{errors.purpose}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
          <select 
            name="language" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white" 
            value={formData.language} 
            onChange={handleChange}
          >
            <option value="">Select Language</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
            <option value="Telugu">Telugu</option>
            <option value="Marathi">Marathi</option>
            <option value="English">English</option>
          </select>
          {errors.language && <div className="text-red-600 text-sm mt-1">{errors.language}</div>}
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ApplyForm;
