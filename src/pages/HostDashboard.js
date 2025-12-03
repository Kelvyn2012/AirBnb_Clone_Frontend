import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/HostDashboard.css';

const HostDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHostData();
  }, []);

  const fetchHostData = async () => {
    try {
      const [propertiesRes, bookingsRes] = await Promise.all([
        api.get('/api/properties/my-properties/'),
        api.get('/api/bookings/host/')
      ]);

      setProperties(propertiesRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error fetching host data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await api.delete(`/api/properties/${propertyId}/`);
      fetchHostData();
      alert('Property deleted successfully');
    } catch (error) {
      alert('Failed to delete property');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await api.patch(`/api/bookings/${bookingId}/`, { status });
      fetchHostData();
      alert(`Booking ${status} successfully`);
    } catch (error) {
      alert('Failed to update booking status');
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="host-dashboard">
      <div className="dashboard-header">
        <h1>Host Dashboard</h1>
        <Link to="/host/create-property" className="btn-primary">
          Add New Property
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{properties.length}</h3>
          <p>Total Properties</p>
        </div>
        <div className="stat-card">
          <h3>{bookings.filter(b => b.status === 'confirmed').length}</h3>
          <p>Confirmed Bookings</p>
        </div>
        <div className="stat-card">
          <h3>{bookings.filter(b => b.status === 'pending').length}</h3>
          <p>Pending Bookings</p>
        </div>
        <div className="stat-card">
          <h3>${bookings.reduce((sum, b) => sum + parseFloat(b.total_price), 0).toFixed(2)}</h3>
          <p>Total Revenue</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>My Properties</h2>
        {properties.length === 0 ? (
          <p>You haven't listed any properties yet</p>
        ) : (
          <div className="properties-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Price/Night</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.property_id}>
                    <td>{property.name}</td>
                    <td>{property.location}</td>
                    <td>${property.pricepernight}</td>
                    <td>
                      <span className={`status ${property.is_active ? 'active' : 'inactive'}`}>
                        {property.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="actions">
                      <Link to={`/property/${property.property_id}`} className="btn-small">
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteProperty(property.property_id)}
                        className="btn-small btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Recent Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          <div className="bookings-table">
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Guest</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.booking_id}>
                    <td>{booking.property.name}</td>
                    <td>{booking.user.first_name} {booking.user.last_name}</td>
                    <td>{new Date(booking.start_date).toLocaleDateString()}</td>
                    <td>{new Date(booking.end_date).toLocaleDateString()}</td>
                    <td>${booking.total_price}</td>
                    <td>
                      <span className={`status status-${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="actions">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateBookingStatus(booking.booking_id, 'confirmed')}
                            className="btn-small btn-success"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleUpdateBookingStatus(booking.booking_id, 'canceled')}
                            className="btn-small btn-danger"
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;
