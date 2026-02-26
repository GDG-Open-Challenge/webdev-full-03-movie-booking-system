import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SeatSelection.css";

function SeatSelection({ movie, onSelectSeats, onBack }) {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeats = async () => {
      setLoading(true);
      try {
        await axios.post(
          `http://localhost:5000/api/seats/initialize/${movie._id}`,
        );
        const response = await axios.get(
          `http://localhost:5000/api/seats/movie/${movie._id}`,
        );
        setSeats(response.data);
      } catch (error) {
        console.error("Error loading seats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSeats();
  }, [movie._id]);

  const initializeSeats = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/seats/initialize/${movie._id}`,
      );
    } catch (error) {
      console.error("Error initializing seats:", error);
    }
  };

  const fetchSeats = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/seats/movie/${movie._id}`,
      );
      setSeats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching seats:", error);
      setLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    if (selectedSeats.includes(seat.seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seat.seatNumber]);
    }
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    onSelectSeats(selectedSeats);
  };

  if (loading) return <div className="container">Loading seats...</div>;

  const rows = ["A", "B", "C", "D", "E"];

  return (
    <div className="container">
      <div className="seat-selection-header">
        <h2>{movie.title}</h2>
        <button onClick={onBack}>← Back</button>
      </div>

      <div className="screen">SCREEN</div>

      <div className="seats-container">
        {rows.map((row) => (
          <div key={row} className="seats-row" style={{ display: "flex" }}>
            <div className="row-label">{row}</div>
            {seats
              .filter((s) => s.seatNumber.startsWith(row))
              .map((seat) => (
                <div
                  key={seat._id}
                  className={`seat ${seat.isBooked ? "booked" : "available"} ${
                    selectedSeats.includes(seat.seatNumber) ? "selected" : ""
                  }`}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat.seatNumber.substring(1)}
                </div>
              ))}
            <div className="row-label">{row}</div>
          </div>
        ))}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="seat available"></div> Available
        </div>
        <div className="legend-item">
          <div className="seat booked"></div> Booked
        </div>
        <div className="legend-item">
          <div className="seat selected"></div> Selected
        </div>
      </div>

      <div className="seat-selection-footer">
        <div className="selected-seats">
          <p>Selected Seats: {selectedSeats.join(", ") || "None"}</p>
          <p className="total">Total: ₹{selectedSeats.length * movie.price}</p>
        </div>
        <button onClick={handleProceed} disabled={selectedSeats.length === 0}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default SeatSelection;
