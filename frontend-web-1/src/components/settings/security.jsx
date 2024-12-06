import React, { useState, useEffect } from 'react'
import { changePassword } from '../../services/authService';
import ResponseModal from '../response-modal/response-modal';

const Security = () => {
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

    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!isFormValid) {
            setError("Please meet all password requirements.");
            return;
        }

        try {
            await changePassword(password);
            setResponseMessage('Password changed successfully.');
            setShowResponseModal(true);
            setPassword('');
            setConfirmPassword('');
            setShowPassword(false);
        } catch (err) {
            setError('Failed to reset password. Please try again.');
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
        <div>
            <ResponseModal 
                show={showResponseModal}
                message={responseMessage}
                onHide={() => setShowResponseModal(false)}
            />
            <form onSubmit={handleSubmit}>
                <div className='form-groups'>
                    {error && <p className="error-msg">{error}</p>}
                    <div className="form-group">
                        <label>New Password</label>
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
                        <label>Confirm Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="confirm-password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <div className="guide">
                            <ul className="password-g">
                                <li className={password !== '' ? (confirmPassword === password ? 'good' : 'fail') : ''}>Passwords must match.</li>
                            </ul>
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
                        <button>Save changes</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Security;