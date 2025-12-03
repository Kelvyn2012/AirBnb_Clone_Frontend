import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/api/bookings/');
      // Handle paginated response
      setBookings(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.patch(`/api/bookings/${bookingId}/`, { status: 'canceled' });
      fetchBookings();
      alert('Booking cancelled successfully');
    } catch (error) {
      alert('Failed to cancel booking');
    }
  };

  const handlePayment = async (booking) => {
    try {
      await api.post('/api/payments/create/', {
        booking_id: booking.booking_id,
        amount: booking.total_price,
        payment_method: 'credit_card'
      });
      alert('Payment successful!');
      fetchBookings();
    } catch (error) {
      alert('Payment failed');
    }
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="bookings-page">
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You don't have any bookings yet</p>
          <Link to="/" className="btn-primary">Browse Properties</Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.booking_id} className="booking-card">
              <div className="booking-image">
                {booking.property.primary_image ? (
                  <img src={booking.property.primary_image} alt={booking.property.name} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>

              <div className="booking-details">
                <h3>{booking.property.name}</h3>
                <p className="location">{booking.property.location}</p>

                <div className="booking-info">
                  <div className="info-item">
                    <strong>Check-in:</strong> {new Date(booking.start_date).toLocaleDateString()}
                  </div>
                  <div className="info-item">
                    <strong>Check-out:</strong> {new Date(booking.end_date).toLocaleDateString()}
                  </div>
                  <div className="info-item">
                    <strong>Guests:</strong> {booking.guests}
                  </div>
                  <div className="info-item">
                    <strong>Nights:</strong> {booking.nights}
                  </div>
                  <div className="info-item">
                    <strong>Total Price:</strong> ${booking.total_price}
                  </div>
                </div>

                <div className={`booking-status status-${booking.status}`}>
                  Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>

                <div className="booking-actions">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handlePayment(booking)}
                        className="btn-primary"
                      >
                        Pay Now
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking.booking_id)}
                        className="btn-danger"
                      >
                        Cancel Booking
                      </button>
                    </>
                  )}

                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking.booking_id)}
                      className="btn-danger"
                    >
                      Cancel Booking
                    </button>
                  )}

                  <Link
                    to={`/property/${booking.property.property_id}`}
                    className="btn-secondary"
                  >
                    View Property
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
