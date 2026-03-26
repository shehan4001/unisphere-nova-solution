import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '../SplashScreen/SplashScreen'; 
import './Login.css';
import axios from 'axios'; 

// Assets Import
import logoImg from '../../assets/images/login logo.png'; 
import bgImage from '../../assets/images/background.png'; 
import idIcon from '../../assets/images/id-icon.png';
import eyeIcon from '../../assets/images/eye-icon.png';      
import eyeClose from '../../assets/images/eye-close.png';   
import secureIcon from '../../assets/images/secure-icon.png';

const Login = () => {
  const navigate = useNavigate();
  
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const [userId, setUserId] = useState(''); // මේ නම තමයි පහළ axios එකේදී පාවිච්චි කරන්නේ
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
      setIsFirstLoad(false);
    } else {
      setIsFirstLoad(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('hasSeenSplash', 'true');
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, []);

  // --- Backend එකට සම්බන්ධ වන Function එක (FIXED) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (userId.trim() === "" || password.trim() === "") {
      alert("Please enter both ID and Password.");
      return;
    }

    setLoading(true);

    try {
      // FIX: 'id' වෙනුවට 'userId' ලෙස වෙනස් කළා
      const response = await axios.post('http://localhost:5000/api/login', {
          customID: userId, 
          password: password
      });

      if (response.data.success) {
        // 1. කලින් සිටි User දත්ත මකා දමන්න
        localStorage.clear(); 

        // 2. අලුත් User දත්ත localStorage එකේ සේව් කරන්න
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // 3. Role එක අනුව අදාළ Dashboard එකට යවන්න
        // Backend එකෙන් එවන්නේ "Admin" හෝ "Student" ලෙසයි
        if (response.data.user.Role === 'Admin') {
          navigate('/admin/dashboard'); 
        } else {
          navigate('/menu'); 
        }

      } else {
        alert("Invalid Credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      // Backend එකෙන් එවන Error Message එක පෙන්වීම
      const errorMsg = error.response?.data?.message || "Login failed! Please check your ID and Password.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className={`login-screen ${isFirstLoad ? 'main-content-fade' : ''}`}> 
      <div className="background-container">
        <img src={bgImage} alt="background" className="bg-image" />
      </div>

      <div className="login-content">
        <div className="brand-section">
          <img src={logoImg} alt="UniSphere Logo" className="main-logo" />
          <p className="brand-subtitle">Campus Management Portal</p>
        </div>

        <div className="login-card">
          <h2 className="welcome-text">Welcome</h2>
          <p className="instruction">Please enter your credentials to access the campus portal.</p>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="input-box">
              <label>Student / Staff ID</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder="e.g. ST-0001 or AD-0001" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
                <img src={idIcon} alt="ID Icon" className="input-icon-png" />
              </div>
            </div>

            <div className="input-box">
              <label>Password</label>
              <div className="input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="toggle-btn" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img 
                    src={showPassword ? eyeIcon : eyeClose} 
                    alt="Toggle" 
                    className="input-icon-png" 
                  />
                </button>
              </div>
            </div>

            <div className="form-footer">
              <label className="checkbox-label">
                <input type="checkbox" /> Remember me
              </label>
              <a href="/forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? "Verifying..." : "Log In"}
            </button>
          </form>

          <div className="divider">or</div>
          <a href="/create-account" className="create-account-link">Create new account</a>
        </div>

        <div className="secure-tag">
          <div className="secure-info">
            <img src={secureIcon} alt="Secure" className="secure-png" />
            <p>SECURE INSTITUTIONAL LOGIN</p>
          </div>
          <a href="/help-center" className="help-center-link">Help Center</a>
        </div>
      </div>
    </div>
  );
};

export default Login;