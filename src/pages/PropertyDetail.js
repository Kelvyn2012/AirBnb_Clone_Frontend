import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/PropertyDetail.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    start_date: '',
    end_date: '',
    guests: 1
  });
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchPropertyDetails();
    fetchReviews();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await api.get(`/api/properties/${id}/`);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/api/reviews/property/${id}/`);
      // Handle paginated response from API
      setReviews(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/api/bookings/create/', {
        property_id: id,
        ...bookingData
      });
      alert('Booking created successfully!');
      setShowBookingForm(false);
      navigate('/bookings');
    } catch (error) {
      alert(error.response?.data?.error || 'Booking failed');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/api/reviews/create/', {
        property_id: id,
        ...reviewData
      });
      alert('Review submitted successfully!');
      setShowReviewForm(false);
      fetchReviews();
      setReviewData({ rating: 5, comment: '' });
    } catch (error) {
      alert(error.response?.data?.error || 'Review submission failed');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!property) return <div className="error">Property not found</div>;

  return (
    <div className="property-detail">
      <div className="property-header">
        <h1>{property.name}</h1>
        <p className="location">{property.location}</p>
      </div>

      <div className="property-images">
        {property.images && property.images.length > 0 ? (
          <div className="images-grid">
            {property.images.map((image) => (
              <img key={image.image_id} src={image.image} alt={property.name} />
            ))}
          </div>
        ) : (
          <div className="no-image-placeholder">No images available</div>
        )}
      </div>

      <div className="property-content">
        <div className="property-main">
          <div className="property-host">
            <h3>Hosted by {property.host.first_name} {property.host.last_name}</h3>
          </div>

          <div className="property-specs">
            <span>{property.bedrooms} bedrooms</span>
            <span>{property.bathrooms} bathrooms</span>
            <span>{property.max_guests} guests</span>
          </div>

          <div className="property-description">
            <h3>About this place</h3>
            <p>{property.description}</p>
          </div>

          {property.amenities && (
            <div className="property-amenities">
              <h3>Amenities</h3>
              <p>{property.amenities}</p>
            </div>
          )}

          <div className="property-reviews">
            <h3>Reviews ({reviews.length})</h3>

            {isAuthenticated && !showReviewForm && (
              <button onClick={() => setShowReviewForm(true)} className="btn-secondary">
                Write a Review
              </button>
            )}

            {showReviewForm && (
              <form onSubmit={handleReview} className="review-form">
                <div className="form-group">
                  <label>Rating</label>
                  <select
                    value={reviewData.rating}
                    onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Terrible</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Comment</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary">Submit Review</button>
                <button type="button" onClick={() => setShowReviewForm(false)} className="btn-secondary">
                  Cancel
                </button>
              </form>
            )}

            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.review_id} className="review-item">
                  <div className="review-header">
                    <strong>{review.user.first_name} {review.user.last_name}</strong>
                    <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p>{review.comment}</p>
                  <small>{new Date(review.created_at).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="property-sidebar">
          <div className="booking-card">
            <div className="price">
              <strong>${property.pricepernight}</strong> / night
            </div>

            {!showBookingForm ? (
              <button
                onClick={() => setShowBookingForm(true)}
                className="btn-primary btn-block"
              >
                Book Now
              </button>
            ) : (
              <form onSubmit={handleBooking} className="booking-form">
                <div className="form-group">
                  <label>Check-in</label>
                  <input
                    type="date"
                    value={bookingData.start_date}
                    onChange={(e) => setBookingData({ ...bookingData, start_date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Check-out</label>
                  <input
                    type="date"
                    value={bookingData.end_date}
                    onChange={(e) => setBookingData({ ...bookingData, end_date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Guests</label>
                  <input
                    type="number"
                    min="1"
                    max={property.max_guests}
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary btn-block">
                  Confirm Booking
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="btn-secondary btn-block"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
