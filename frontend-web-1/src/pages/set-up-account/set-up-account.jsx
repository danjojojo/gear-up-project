import React, { useState, useEffect, useRef } from 'react';
import { register, verifyOTP } from '../../services/authService';
import AuthLayout from '../../components/auth-layout/auth-layout';
import './set-up-account.scss';
import {Modal, Form, Button} from 'react-bootstrap';

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

    const [qrCodeDataURL, setQrCodeDataURL] = useState(null);  // Store the QR code URL
    const [otp, setOtp] = useState('');  // OTP input for 2FA verification
    const [otpError, setOtpError] = useState(null);  // Error if OTP verification fails

    const [showModalOTP, setShowModalOTP] = useState(false);

    const otpRef = useRef(null);

    const errorMsgStyle = {
        color: '#cb2020',
        fontSize: '1rem',
        marginTop: '15px',
        padding: '10px 0',
        textAlign: 'center',
        backgroundColor: '#ff5a5a45',
        borderRadius: '5px',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            setError("Please meet all password requirements.");
            setShowError(true);
            return;
        }

        try {
            const data = await register(email, password);
            setQrCodeDataURL(data.qrCodeDataURL);
            setShowModalOTP(true);
            // window.location.reload();
            setError(null);  // Clear any previous error
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

        // Clear error if requirements are met
        if (meetsRequirements && passwordsMatch) {
            setError(null);
        }
    }, [password, confirmPassword]);

    const handleOTPSubmit = async (otp) => {

        try {
            const response = await verifyOTP(otp); // Call backend to verify OTP
            if (response.message) {
                window.location.href = '/';  // Redirect to login if successful
            } else {
                setOtpError("Invalid OTP. Please try again.");
            }
        } catch (err) {
            setOtpError("Failed to verify OTP. Please try again.");
        }
    };

    function ModalOTP({ onHide, onConfirm, ...props }) {
        return (
            <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                2FA Setup
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>                        
                {qrCodeDataURL && (
                    <div className="qr-code" style={{display: 'flex', flexDirection: 'column'}}>
                        <h5>Scan to Enable 2FA</h5>
                        <p>Scan the QR Code in your Google Authenticator or any authenticator app.</p>
                        <p>Do not share this with anyone.</p>
                        <img src={qrCodeDataURL} alt="2FA QR Code" style={{width: '200px', margin: '0 auto'}}/>
                        <label htmlFor="">Enter the OTP</label>
                        <input
                            ref={otpRef}
                            type="text"
                            placeholder="XXXXXX"
                            maxLength="6"
                            id='otp'
                        />
                        {otpError && <p style={errorMsgStyle}>{otpError}</p>}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => {
                    const otp = otpRef.current.value;
                    if(otp === '') {
                        setOtpError('Please enter OTP.');
                    } else if (otp.length < 6){
                        setOtpError('OTP must be 6 characters.');
                    } else {
                        handleOTPSubmit(otp);
                    }
                }}>
                Confirm
                </Button>
            </Modal.Footer>
            </Modal>
        );
    }

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
                                autocomplete='off'
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
            <ModalOTP
                show={showModalOTP}
                onHide={() => setShowModalOTP(false)}
            />
        </div>
    );
};

export default SetUpAccount;
