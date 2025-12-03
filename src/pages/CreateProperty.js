import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/CreateProperty.css';

const CreateProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    pricepernight: '',
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 1,
    amenities: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/properties/create/', formData);
      const propertyId = response.data.property_id;

      // Upload images if any
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const formData = new FormData();
          formData.append('image', images[i]);
          formData.append('is_primary', i === 0);

          await api.post(`/api/properties/${propertyId}/images/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
      }

      alert('Property created successfully!');
      navigate('/host/dashboard');
    } catch (err) {
      setError('Failed to create property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-property-page">
      <h1>List Your Property</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="property-form">
        <div className="form-group">
          <label>Property Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>

        <div className="form-group">
          <label>Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, Country"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price Per Night ($) *</label>
            <input
              type="number"
              name="pricepernight"
              value={formData.pricepernight}
              onChange={handleChange}
              min="1"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Bedrooms *</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Bathrooms *</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Max Guests *</label>
            <input
              type="number"
              name="max_guests"
              value={formData.max_guests}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Amenities</label>
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="WiFi, Kitchen, Air conditioning (comma-separated)"
          />
        </div>

        <div className="form-group">
          <label>Property Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <small>First image will be set as primary</small>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Property...' : 'Create Property'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/host/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProperty;
