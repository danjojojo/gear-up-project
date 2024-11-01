import React, { useState, useEffect } from 'react';
import { register } from '../../services/authService';
import AuthLayout from '../../components/auth-layout/auth-layout';
import './set-up-account.scss';

const SetUpAccount = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showError, setShowError] = useState(false);

    const [pwHasLowerCase, setPwHasLowerCase] = useState(false);
    const [pwHasUpperCase, setPwHasUpperCase] = useState(false);
    const [pwHasNumber, setPwHasNumber] = useState(false);
    const [pwHasSpecialChar, setPwHasSpecialChar] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('1');

        if (!isFormValid) {
            setError("Please meet all password requirements.");
            setShowError(true);
            return;
        }

        try {
            await register(email, password);
            window.location.reload();
        } catch (err) {
            setError('Failed to set up account. Please try again.');
        }
    };

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
        <div className='set-up-account'>
            <AuthLayout formData={
                <div>
                    <div className="intro">
                        <h4 className='header'>Set up Account</h4>
                        <p className='subtitle'>Let's setup your account.</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {(showError && !isFormValid) && <p className="error-msg">Please meet all password requirements.</p>} {/* Display local error message */}
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
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
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirmPassword"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <div className="guide">
                                <ul className="password-g">
                                    <li className={password !== '' ? (confirmPassword === password ? 'good' : 'fail') : ''}>Passwords must match.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Show Password Checkbox */}
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

                        <button type="submit" className="submit-btn">
                            Create Account
                        </button>
                    </form>
                </div>
            } />
        </div>
    );
};

export default SetUpAccount;
