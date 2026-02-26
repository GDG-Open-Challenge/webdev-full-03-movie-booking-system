import React, { useState } from "react";
import axios from "axios";
import "./Checkout.css";

function Checkout({ movie, seats, userId, onBack }) {
  const [loading, setLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const totalPrice = movie.price * seats.length;

  const handleConfirmBooking = async () => {
    setLoading(true);

    console.log("Booking confirmed with seats:", seats);
    console.log("Total price:", totalPrice);

    try {
      const response = await axios.post("http://localhost:5000/bookings", {
        movieId: movie._id,
        userId: userId,
        seats: seats,
        totalAmount: totalPrice,
      });

      console.log("Booking response:", response.data);

      setBookingConfirmed(true);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (bookingConfirmed) {
    return (
      <div className="container">
        <div className="confirmation-page">
          <div className="success-message">
            <h2>✓ Booking Confirmed!</h2>
            <p className="confirmation-details">
              Movie: <strong>{movie.title}</strong>
            </p>
            <p className="confirmation-details">
              Seats: <strong>{seats.join(", ")}</strong>
            </p>
            <p className="confirmation-details">
              Total Amount: <strong>₹{totalPrice}</strong>
            </p>
            <p className="confirmation-details">
              Your booking has been confirmed. Please check your email for
              details.
            </p>
            <button onClick={onBack}>Book Another Movie</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="checkout-header">
        <h2>Checkout</h2>
        <button onClick={onBack}>← Back</button>
      </div>

      <div className="checkout-content">
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-item">
            <span>Movie:</span>
            <span>{movie.title}</span>
          </div>
          <div className="summary-item">
            <span>Seats:</span>
            <span>{seats.join(", ")}</span>
          </div>
          <div className="summary-item">
            <span>Number of Seats:</span>
            <span>{seats.length}</span>
          </div>
          <div className="summary-item">
            <span>Price per Seat:</span>
            <span>₹{movie.price}</span>
          </div>
          <div className="summary-item total">
            <span>Total Amount:</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        <div className="payment-section">
          <h3>Payment Details</h3>
          <form className="payment-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input type="text" placeholder="MM/YY" maxLength="5" required />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input type="text" placeholder="123" maxLength="3" required />
              </div>
            </div>
          </form>

          <button
            className="confirm-btn"
            onClick={handleConfirmBooking}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
