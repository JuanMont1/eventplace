import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import udecLogo from '../archivos/img/logoyu.png'; 

const Login = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    setFadeOut(true);
    setTimeout(() => navigate('/register'), 500); 
  };

  const handleGoogleLogin = () => {
    console.log("Iniciar sesión con Google");
  };

  return (
    <div className={`login-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="login-box">
        <img src={udecLogo} alt="Logo UdeC" className="login-logo" />
        <h1 className="login-title"> ¡Los eventos te esperan! </h1>
        <p className="login-subtitle">
          Bienvenido al sistema de eventos de la Universidad de Cundinamarca
        </p>

        <form className="login-form">
          <label>Correo institucional</label>
          <input type="email" placeholder="usuario@ucundinamarca.edu.co" required />

          <label>Contraseña</label>
          <input type="password" placeholder="********" required />

          <button type="submit" className="login-btn">Iniciar Sesión</button>
        </form>

        <p className="forgot-password">
          ¿Olvidaste tu contraseña? <a href="#">Recupérala aquí</a>
        </p>

        <div className="divider">____________________ o ____________________</div>

        <button onClick={handleGoogleLogin} className="google-btn">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="google-icon" />
          Iniciar sesión con Google
        </button>

        <p className="register">
          ¿No tienes cuenta? <a onClick={handleRegisterClick} style={{ cursor: 'pointer' }}>Regístrate</a>
        </p>
      </div>


    </div>
  );
};

export default Login;
