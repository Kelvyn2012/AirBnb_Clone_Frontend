import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PropertyCard.css';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/property/${property.property_id}`);
  };

  return (
    <div className="property-card" onClick={handleClick}>
      <div className="property-image">
        {property.primary_image ? (
          <img src={property.primary_image} alt={property.name} />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>

      <div className="property-info">
        <h3 className="property-name">{property.name}</h3>
        <p className="property-location">{property.location}</p>

        <div className="property-details">
          <span>{property.bedrooms} bed</span>
          <span>{property.bathrooms} bath</span>
          <span>{property.max_guests} guests</span>
        </div>

        <div className="property-footer">
          <div className="property-price">
            <strong>${property.pricepernight}</strong> / night
          </div>

          {property.average_rating > 0 && (
            <div className="property-rating">
              ⭐ {property.average_rating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
