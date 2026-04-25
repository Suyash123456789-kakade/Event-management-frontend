import React, { useState } from 'react';
import { X, Mail, ShieldCheck } from 'lucide-react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!res.ok) throw new Error('Failed to send OTP');
      
      setStep('otp');
    } catch (err) {
      setError('Error sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      localStorage.setItem('token', data.token);
      onLoginSuccess(data.user);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
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

        {step === 'email' ? (
          <form className="auth-form" onSubmit={handleEmailSubmit}>
            <div className="input-group">
              <Mail className="input-icon" size={20} style={{marginLeft: '10px'}}/>
              <input
                style={{paddingLeft: '40px'}}
                type="email"
                placeholder="Continue with Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                disabled={loading}
              />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="btn-primary full-width" disabled={loading}>
              {loading ? 'Sending...' : 'Continue'}
            </button>
            <div className="terms-text">
              I agree to the <a href="#">Terms & Conditions</a> & <a href="#">Privacy Policy</a>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleOtpSubmit}>
            <div className="otp-info">
              <ShieldCheck size={40} className="shield-icon" />
              <p>We've sent an OTP to {email}</p>
            </div>
            <div className="input-group otp-group">
              <input
                type="text"
                placeholder="Enter 6-digit OTP (Check console)"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                autoFocus
                className="otp-input"
                disabled={loading}
              />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="btn-primary full-width" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <div className="resend-text">
              Didn't receive it? <button type="button" onClick={() => setStep('email')}>Change Email</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
