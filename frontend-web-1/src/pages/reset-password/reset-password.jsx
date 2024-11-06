import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/auth-context';
import AuthLayout from '../../components/auth-layout/auth-layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/authService';
import './reset-password.scss';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [pwHasLowerCase, setPwHasLowerCase] = useState(false);
  const [pwHasUpperCase, setPwHasUpperCase] = useState(false);
  const [pwHasNumber, setPwHasNumber] = useState(false);
  const [pwHasSpecialChar, setPwHasSpecialChar] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isFormValid) {
        setError("Please meet all password requirements.");
        return;
    }

    try {
      await resetPassword(email, token, password);
      navigate('/login');
    } catch (err) {
      setError('Failed to reset password. Please try again or request a new reset link.');
    }
  }

  useEffect(() => {
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!_@#$%^&*(),.?":{}|<>]/.test(password);

        setPwHasLowerCase(hasLowerCase);
        setPwHasUpperCase(hasUpperCase);
        setPwHasNumber(hasNumber);
        setPwHasSpecialChar(hasSpecialChar);

        const meetsRequirements = password.length >= 8 && hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
        const passwordsMatch = password === confirmPassword;

        setIsFormValid(meetsRequirements && passwordsMatch);
        console.log(meetsRequirements, passwordsMatch);

        // Clear error if requirements are met
        if (meetsRequirements && passwordsMatch) {
            setError(null);
        }
    }, [password, confirmPassword]);

  return (
    <div className='reset'>
      <AuthLayout formData={
            <div>
              <div className="intro">
                <h4 className='header'>Reset Password</h4>
                <p className='subtitle'>Enter your new password.</p>
              </div>
              <form onSubmit={handleSubmit}>
                {error && <p className="error-msg">{error}</p>}
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="guide">
                      <ul className="password-guide">
                          <li className={password !== '' ? (pwHasLowerCase ? 'good' : 'fail') : ''}>One lowercase letter</li>
                          <li className={password !== '' ? (pwHasUpperCase ? 'good' : 'fail') : ''}>One uppercase letter</li>
                          <li className={password !== '' ? (pwHasNumber ? 'good' : 'fail') : ''}>One number</li>
                          <li className={password !== '' ? (pwHasSpecialChar ? 'good' : 'fail') : ''}>One special character</li>
                          <li className={password !== '' ? (password.length >= 8 ? 'good' : 'fail') : ''}>8 characters minimum</li>
                      </ul>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div className="guide">
                      <ul className="password-g">
                          <li className={password !== '' ? (confirmPassword === password ? 'good' : 'fail') : ''}>Passwords must match.</li>
                      </ul>
                  </div>
                </div>
                <div className="show-password">
                      <label>
                          <input
                              type="checkbox"
                              checked={showPassword}
                              onChange={() => setShowPassword(!showPassword)}
                          />
                          Show Password
                      </label>
                  </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Loading...' : 'Save'}
                </button>
              </form>
            </div>
      }/>
    </div>
  )
}

export default ResetPassword;