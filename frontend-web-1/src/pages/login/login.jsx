import React, { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import AuthLayout from '../../components/auth-layout/auth-layout';
import './login.scss';
import { Modal, Button } from 'react-bootstrap';
import { forgotPassword } from '../../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { loginAdmin, handleVerifyAdminOTP } = useContext(AuthContext);
  const navigate = useNavigate();
  const otpRef = useRef(null);
  const [showModalOTP, setShowModalOTP] = useState(false);
  const [otpError, setOtpError] = useState(null);

  const [loading, setLoading] = useState(false);

  const [loginView, setLoginView] = useState(true);

  const errorMsgStyle = {
    color: '#cb2020',
    fontSize: '1rem',
    marginTop: '15px',
    padding: '10px 0',
    textAlign: 'center',
    backgroundColor: '#ff5a5a45',
    borderRadius: '5px',
  };

  const inputStyle = {
    fontSize: '1rem',
    marginTop: '15px',
    padding: '5px',
    borderRadius: '5px',
    border: '2px solid #ccc'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOtpError(null);

    try {
      await loginAdmin(email, password);
      setShowModalOTP(true);  // Show OTP modal if required
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleOTPSubmit = async () => {
    const otp = otpRef.current.value;
    try {
      const {message} = await handleVerifyAdminOTP(email, otp);
      alert(message);
    } catch (err) {
      setOtpError('Invalid OTP. Please try again.');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await forgotPassword(email);
      setError(null);
      alert('Reset link sent. Please check your email.');
      navigate('/login');
    } catch (error) {
      console.error('Error sending reset link:', error);
      setError('Failed to send reset link. Please try again.');
      setLoading(false);
    }
  }

  function ModalOTP({ onHide, ...props }) {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onHide={onHide}>
          <Modal.Title id="contained-modal-title-vcenter">
            2FA Required
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="otp">Enter the OTP from Google Authenticator or any authenticator app you used for this email</label>
            <input style={inputStyle}
              ref={otpRef}
              type="text"
              placeholder="XXXXXX"
              maxLength="6"
              id='otp'
            />
            {otpError && <p style={errorMsgStyle}>{otpError}</p>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleOTPSubmit}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  function goToForgotPassword() {
    setLoginView(false);
    setEmail('');
    setLoading(false);
    setError(null);
  }

  function goToLogin() {
    setLoginView(true);
    setEmail('');
    setLoading(false);
    setError(null);
  }

  return (
    <div className='login'>
      {loginView && 
        <>
          <ModalOTP
            show={showModalOTP}
            onHide={() => setShowModalOTP(false)}
          />
          <AuthLayout formData={
            <div>
              <div className="intro">
                <h4 className='header'>Login</h4>
                <p className='subtitle'>Enter your email and password to login to your account.</p>
              </div>
              <form onSubmit={handleSubmit}>
                {error && <p className="error-msg">{error}</p>}
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete='off'
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="toggle-text-3" onClick={goToForgotPassword}>Forgot password?</p>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Loading...' : 'Login'}
                </button>
              </form>
              <p className="toggle-text">
                <Link to="/login-pos" className="toggle-text">Login as POS &rarr;</Link>
              </p>
            </div>
          } />
        </>
      }
      {!loginView && 
        <>
          <AuthLayout formData={
            <div>
              <p className="toggle-text-2" onClick={goToLogin}>&larr; Back to Login</p>
              <div className="intro">
                <h4 className='header'>Forgot Password</h4>
                <p className='subtitle'>Enter your email to receive a password reset link.</p>
              </div>
              {error && <p className="error-msg">{error}</p>}
              <form onSubmit={handleForgotPasswordSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email*</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete='off'
                    required
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Loading...' : 'Send Reset Link'}
                </button>
              </form>
            </div>
          }/>
        </>
      }
    </div>
  );
};

export default Login;
