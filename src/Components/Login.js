import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from '../firebase'; 
import udecLogo from '../archivos/img/logoyu.png';
import '../styles/Login.css';

const Login = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    setFadeOut(true);
    setTimeout(() => navigate('/register'), 500); 
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Usuario logueado:", result.user);
      
      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          createdAt: serverTimestamp(),
        });
      } else {
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
      }

      navigate('/');
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/perfil');
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className={`login-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="login-box">
        <img src={udecLogo} alt="Logo UdeC" className="login-logo" />
        <h1 className="login-title"> ¡Los eventos te esperan! </h1>
        <p className="login-subtitle">
          Bienvenido al sistema de eventos de la Universidad de Cundinamarca
        </p>

        <form className="login-form" onSubmit={handleLogin}>
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

        <button onClick={handleGoogleLogin} className="google-btn" disabled={isLoading}>
          {isLoading ? (
            "Cargando..."
          ) : (
            <>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="google-icon" />
              Iniciar sesión con Google
            </>
          )}
        </button>

        <p className="register">
          ¿No tienes cuenta? <a onClick={handleRegisterClick} style={{ cursor: 'pointer' }}>Regístrate</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
