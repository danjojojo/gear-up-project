import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context"; // Import AuthContext
import AuthLayout from "../../components/auth-layout/auth-layout";
import "./login-pos.scss";
import { checkPosExists } from "../../services/authService";

const LoginPOS = () => {
  const [isSelectPOS, setSelectPOS] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [posExists, setPosExists] = useState(false);
  const [posUsers, setPosUsers] = useState([]);
  const [selectedPosID, setSelectedPosID] = useState("");
  const [selectedPosName, setSelectedPosName] = useState("");
  const navigate = useNavigate();
  const { loginPOSUser } = React.useContext(AuthContext); // Use AuthContext
  const [loading, setLoading] = useState(true);

  const checkIfPosExist = async () => {
    try {
      const { exists, users } = await checkPosExists(); // Get existence status and users
      setPosExists(exists); // Update state with existence status
      setTimeout(() => {
        setLoading(false);
        setPosUsers(users); // Update state with users data
      }, 1000);
    } catch (err) {
      setPosExists(false);
      setTimeout(() => {
        setLoading(false);
        setError("Something went wrong while checking POS existence.");
      }, 1000);
    }
  };

  useEffect(() => {
    checkIfPosExist();
  }, []);

  const handleLoginPOS = async (e) => {
    e.preventDefault();
    try {
      // Call loginPOSUser from context
      const data = await loginPOSUser(selectedPosID, password);
      if (data.role === "staff") {
        navigate("/");
      } else {
        setError("Incorrect role. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-pos">
      <AuthLayout
        formData={
          <div>
            {isSelectPOS ? (
              <div>
                <p
                  className="go-back"
                  onClick={() => {
                    setSelectPOS(false);
                    setPassword("");
                    setError("");
                  }}
                >
                  &larr; Select POS
                </p>
                <div className="intro">
                  <h4 className='header'>POS Login</h4>
                  <p className='subtitle'>Enter your password to login to your account.</p>
                </div>
                <form onSubmit={handleLoginPOS}>
                  {error && <p className="error-msg">{error}</p>}
                  <div className="form-group">
                    <input type="hidden" id="id" value={selectedPosID} />
                    <div className="pos_name">
                      <i className="fa-solid fa-circle-user"></i>
                      <p>{selectedPosName}</p>
                    </div>
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="submit-btn">
                    Login
                  </button>
                </form>
              </div>
            ) : posExists ? (
              <div className="select-pos row d-flex justify-content-center">
                {!loading && <div className="intro">
                  <h4 className='header'>Select a POS Account</h4>
                </div>}
                {loading && (
                  <div className="loading">
                    <i className="fa-solid fa-gear fa-spin"></i>
                  </div>
                )}
                {!loading &&
                  posUsers.map((posUser) => (
                    <button
                      className="pos-1"
                      onClick={() => {
                        setSelectPOS(true);
                        setSelectedPosID(posUser.pos_id);
                        setSelectedPosName(posUser.pos_name);
                      }}
                      key={posUser.pos_id}
                    >
                      {posUser.pos_name} {/* Display pos_name */}
                    </button>
                  ))}
              </div>
            ) : (
              <div className="select-pos row d-flex justify-content-center">
                {!loading && (
                  <p className="toggle-text">
                    There is no POS account created yet.
                  </p>
                )}
              </div>
            )}
            {!loading && !isSelectPOS && <p className="toggle-text">
              <Link to="/login" className="toggle-text">&larr; Login as Admin</Link>
            </p>}
          </div>
        }
      />
    </div>
  );
};

export default LoginPOS;
