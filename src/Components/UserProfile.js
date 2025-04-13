import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut, updatePassword } from "firebase/auth";
import "../styles/UserProfile.css";

const TarjetaEvento = ({ evento, manejarCalificacion }) => (
  <div className="tarjeta-evento">
    <div className="evento-imagen" style={{ backgroundImage: `url(${evento.imagen})` }}></div>
    <div className="evento-contenido">
      <h3>{evento.nombre}</h3>
      <p><i className="fas fa-calendar-alt"></i> {evento.fecha}</p>
      <p><i className="fas fa-tag"></i> {evento.categoria}</p>
      <p><i className="fas fa-university"></i> {evento.facultad}</p>
      <div className="calificacion">
        {[1, 2, 3, 4, 5].map((estrella) => (
          <span
            key={estrella}
            className={`estrella ${evento.calificacion >= estrella ? "activa" : ""}`}
            onClick={() => manejarCalificacion(evento.id, estrella)}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  </div>
);

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suscripciones, setSuscripciones] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async (currentUser) => {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser({ id: currentUser.uid, ...userSnap.data() });
        } else {
          setError("No se encontró el perfil del usuario");
        }
      } catch (err) {
        console.error("Error al obtener datos del usuario:", err);
        setError("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser);
      } else {
        setLoading(false);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const storedSuscripciones =
      JSON.parse(localStorage.getItem("suscripciones")) || [];
    console.log("Suscripciones cargadas:", storedSuscripciones);

    // Filtrar suscripciones validas
    const suscripcionesValidas = storedSuscripciones.filter(
      (evento) =>
        evento &&
        evento.id &&
        evento.nombre &&
        evento.categoria &&
        evento.fecha &&
        evento.facultad
    );
    setSuscripciones(suscripcionesValidas);
  }, []);

  const manejarCalificacion = (id, calificacion) => {
    setSuscripciones((prevSuscripciones) => {
      const newSuscripciones = prevSuscripciones.map((evento) =>
        evento.id === id ? { ...evento, calificacion } : evento
      );

      localStorage.setItem("suscripciones", JSON.stringify(newSuscripciones));
      return newSuscripciones;
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleEditProfile = () => {
    setEditMode(true);
    setNewName(user.name);
  };

  const handleSaveProfile = async () => {
    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, { name: newName });
      setUser({ ...user, name: newName });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleChangePassword = async () => {
    try {
      await updatePassword(auth.currentUser, newPassword);
      alert("Password updated successfully!");
      setNewPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please try again.");
    }
  };

  if (loading) return <div className="loading">Cargando perfil...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!user) return <div className="no-user">No se encontró información del usuario</div>;

  return (
    <div className="user-profile">
      <header className="profile-header">
        <Link to="/" className="back-link"><i className="fas fa-arrow-left"></i> Volver al Inicio</Link>
        <h1>Perfil de Usuario</h1>
        <button onClick={handleLogout} className="logout-btn"><i className="fas fa-sign-out-alt"></i> Cerrar Sesión</button>
      </header>

      <main className="profile-content">
        <section className="user-info">
          <div className="user-avatar" style={{ backgroundImage: `url(${user.photoURL})` }}></div>
          <div className="user-details">
            {editMode ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="edit-name-input"
              />
            ) : (
              <h2>{user.name}</h2>
            )}
            <p className="user-role">Estudiante</p>
            {editMode ? (
              <button onClick={handleSaveProfile} className="save-btn">Guardar Cambios</button>
            ) : (
              <button onClick={handleEditProfile} className="edit-btn">Editar Perfil</button>
            )}
          </div>
        </section>

        <section className="user-actions">
          <button onClick={handleChangePassword} className="action-btn">
            <i className="fas fa-key"></i> Cambiar Contraseña
          </button>
          <Link to="/mis-suscripciones" className="action-btn">
            <i className="fas fa-calendar-check"></i> Mis Suscripciones
          </Link>
        </section>

        <section className="eventos-suscritos">
          <h2>Eventos Suscritos</h2>
          <div className="eventos-grid">
            {suscripciones.length > 0 ? (
              suscripciones.map((evento) => (
                <TarjetaEvento
                  key={evento.id}
                  evento={evento}
                  manejarCalificacion={manejarCalificacion}
                />
              ))
            ) : (
              <p className="no-eventos">No estás suscrito a ningún evento.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserProfile;
