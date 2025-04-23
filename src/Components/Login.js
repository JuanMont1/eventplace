import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db, ADMIN_EMAILS } from '../firebase'; 
import udecLogo from '../archivos/img/logoyu.png';
import '../styles/Login.css';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

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
      
      let userData = {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        lastLogin: serverTimestamp(),
      };

      // Verifica si el email del usuario está en la lista de administradores
      if (ADMIN_EMAILS.includes(result.user.email)) {
        userData.role = 'admin';
        console.log("Usuario asignado como admin:", result.user.email);
      } else {
        userData.role = 'user';
        console.log("Usuario asignado como usuario normal:", result.user.email);
      }

      if (!userSnap.exists()) {
        await setDoc(userRef, { ...userData, createdAt: serverTimestamp() });
      } else {
        await setDoc(userRef, userData, { merge: true });
      }

      // Redirigir basado en el rol del usuario
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/MisSuscripciones');
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/MisSuscripciones');
        }
      } else {
        navigate('/MisSuscripciones');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
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

        <form className="login-form" onSubmit={handleSubmit}>
          <label>Correo institucional</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@ucundinamarca.edu.co" required />

          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" required />

          <button type="submit" className="login-btn">Iniciar Sesión</button>
          {error && <p className="error-message">{error}</p>}
        </form>

        <p className="forgot-password">
          ¿Olvidaste tu contraseña? <a href="#">Recupérala aquí</a>
        </p>

        <div className="divider">_________________ o ________________</div>

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