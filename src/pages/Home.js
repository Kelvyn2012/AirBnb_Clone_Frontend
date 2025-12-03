import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import api from '../services/api';
import '../styles/Home.css';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    bedrooms: '',
    bathrooms: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
      if (filters.bathrooms) params.append('bathrooms', filters.bathrooms);
      if (searchTerm) params.append('search', searchTerm);

      const response = await api.get(`/api/properties/?${params.toString()}`);
      setProperties(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchProperties();
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>Find Your Next Stay</h1>
        <p>Discover unique places to stay around the world</p>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      <div className="filters">
        <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange}>
          <option value="">Any Bedrooms</option>
          <option value="1">1 Bedroom</option>
          <option value="2">2 Bedrooms</option>
          <option value="3">3 Bedrooms</option>
          <option value="4">4+ Bedrooms</option>
        </select>

        <select name="bathrooms" value={filters.bathrooms} onChange={handleFilterChange}>
          <option value="">Any Bathrooms</option>
          <option value="1">1 Bathroom</option>
          <option value="2">2 Bathrooms</option>
          <option value="3">3+ Bathrooms</option>
        </select>

        <button onClick={fetchProperties} className="apply-filters">Apply Filters</button>
      </div>

      <div className="properties-container">
        {loading ? (
          <div className="loading">Loading properties...</div>
        ) : properties.length > 0 ? (
          <div className="properties-grid">
            {properties.map((property) => (
              <PropertyCard key={property.property_id} property={property} />
            ))}
          </div>
        ) : (
          <div className="no-properties">No properties found</div>
        )}
      </div>
    </div>
  );
};

export default Home;
