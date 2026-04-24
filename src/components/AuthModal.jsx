import React, { useState } from 'react';
import { X, Smartphone, ShieldCheck } from 'lucide-react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === '123456') {
      onLoginSuccess({ phone });
      handleClose();
    } else {
      setError('Invalid OTP. Please use 123456 for demo.');
    }
  };

  const handleClose = () => {
    setStep('phone');
    setPhone('');
    setOtp('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={handleClose}>
      <div className="modal-content animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          <X size={20} />
        </button>

        <div className="modal-header">
          <h2>Get Started</h2>
          <p>Sign in to unlock the best experience.</p>
        </div>

        {step === 'phone' ? (
          <form className="auth-form" onSubmit={handlePhoneSubmit}>
            <div className="input-group">
              <Smartphone className="input-icon" size={20} />
              <span className="country-code">+91</span>
              <input
                type="tel"
                placeholder="Continue with mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                autoFocus
              />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="btn-primary full-width">Continue</button>
            <div className="terms-text">
              I agree to the <a href="#">Terms & Conditions</a> & <a href="#">Privacy Policy</a>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleOtpSubmit}>
            <div className="otp-info">
              <ShieldCheck size={40} className="shield-icon" />
              <p>We've sent an OTP to +91 {phone}</p>
            </div>
            <div className="input-group otp-group">
              <input
                type="text"
                placeholder="Enter 6-digit OTP (Use 123456)"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                autoFocus
                className="otp-input"
              />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="btn-primary full-width">Verify & Login</button>
            <div className="resend-text">
              Didn't receive it? <button type="button" onClick={() => setStep('phone')}>Change Number</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
