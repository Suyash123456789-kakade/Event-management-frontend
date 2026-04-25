import React, { useState } from 'react';
import { X, QrCode } from 'lucide-react';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose, event, onBookingComplete }) => {
  const [step, setStep] = useState('seats'); // 'seats', 'payment', 'success'
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const SEAT_PRICE = 250;

  if (!isOpen || !event) return null;

  const rows = ['A', 'B', 'C', 'D', 'E'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }
    setError('');
    setStep('payment');
  };

  const handlePaymentSuccess = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          event_id: event.id,
          seats: selectedSeats,
          total_price: selectedSeats.length * SEAT_PRICE
        })
      });

      if (!res.ok) throw new Error('Failed to book tickets');

      setStep('success');
      setTimeout(() => {
        onBookingComplete();
        handleClose();
      }, 2000);

    } catch (err) {
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('seats');
    setSelectedSeats([]);
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={handleClose}>
      <div className="modal-content animate-slide-up booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          <X size={20} />
        </button>

        {step === 'seats' && (
          <div className="seat-selection-step">
            <h2>Select Seats</h2>
            <p className="screen-indicator">Screen this way</p>
            <div className="screen-line"></div>
            
            <div className="seat-matrix">
              {rows.map(row => (
                <div key={row} className="seat-row">
                  <span className="row-label">{row}</span>
                  {cols.map(col => {
                    const seatId = `${row}${col}`;
                    const isSelected = selectedSeats.includes(seatId);
                    return (
                      <button
                        key={seatId}
                        className={`seat-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSeatClick(seatId)}
                      >
                        {col}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            
            <div className="seat-legend">
              <div className="legend-item"><div className="seat-box available"></div> Available</div>
              <div className="legend-item"><div className="seat-box selected"></div> Selected</div>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <div className="booking-footer">
              <div className="price-info">
                <span>{selectedSeats.length} Tickets</span>
                <strong>₹{selectedSeats.length * SEAT_PRICE}</strong>
              </div>
              <button className="btn-primary" onClick={handleProceedToPayment}>
                Proceed to Pay
              </button>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="payment-step">
            <h2>Payment Gateway</h2>
            <div className="payment-amount">Total: ₹{selectedSeats.length * SEAT_PRICE}</div>
            
            <div className="qr-container">
              <QrCode size={120} className="qr-icon" />
              <p>Scan to Pay</p>
            </div>

            <div className="upi-info">
              <label>Or use UPI ID</label>
              <div className="upi-box">showbooker@icici</div>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button 
              className="btn-primary full-width" 
              onClick={handlePaymentSuccess}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'I have completed the payment'}
            </button>
            
            <button className="btn-secondary full-width" onClick={() => setStep('seats')} style={{marginTop: '10px', background: 'none', border: '1px solid #ccc', padding: '10px', borderRadius: '8px', cursor: 'pointer'}}>
              Go Back
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="success-step animate-fade-in">
            <div className="success-icon">✓</div>
            <h2>Booking Confirmed!</h2>
            <p>Your tickets have been booked successfully.</p>
            <p className="redirect-text">Redirecting to your bookings...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
