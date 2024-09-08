import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context'; // Import AuthContext
import AuthLayout from '../../components/auth-layout/auth-layout';
import './login-pos.scss';

const LoginPOS = () => {
    const [isSelectPOS, setSelectPOS] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { loginPOSUser } = React.useContext(AuthContext); // Use AuthContext

    const handleLoginPOS = async (e) => {
        e.preventDefault();
        try {
            const data = await loginPOSUser(password); // Call loginPOSUser from context
            if (data.role === 'staff') {
                navigate('/');
            } else {
                setError('Incorrect role. Please try again.');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className='login-pos'>
            <AuthLayout formData={
                <div>
                    {isSelectPOS ? (
                        <form onSubmit={handleLoginPOS}>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="error">{error}</p>}
                            <button type="submit" className="submit-btn">
                                Login
                            </button>
                        </form>
                    ) : (
                        <div className='select-pos row d-flex justify-content-center'>
                            <button className='pos-1' onClick={() => setSelectPOS(true)}>
                                POS 1
                            </button>
                            <button className='pos-2' onClick={() => setSelectPOS(true)}>
                                POS 2
                            </button>
                        </div>
                    )}

                    <p className="toggle-text">
                        <Link to="/login">Login as Admin</Link>
                    </p>
                </div>
            } />
        </div>
    );
};

export default LoginPOS;