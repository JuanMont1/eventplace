import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut, updatePassword } from "firebase/auth";
import { db, auth } from "../firebase";
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
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suscripciones, setSuscripciones] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserData({ 
              id: user.uid, 
              ...userData,
              photoURL: user.photoURL || userData.photoURL || '/default-avatar.png'
            });
            setSuscripciones(userData.suscripciones || []);
          } else {
            setError("No se encontró el perfil del usuario");
          }
        }
      } catch (err) {
        console.error("Error al obtener datos del usuario:", err);
        setError("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const manejarCalificacion = async (id, calificacion) => {
    try {
      const newSuscripciones = suscripciones.map((evento) =>
        evento.id === id ? { ...evento, calificacion } : evento
      );

      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, { suscripciones: newSuscripciones });
      setSuscripciones(newSuscripciones);
    } catch (error) {
      console.error("Error al actualizar la calificación:", error);
    }
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
    setNewName(userData.name);
  };

  const handleSaveProfile = async () => {
    try {
      const userRef = doc(db, "users", userData.id);
      await updateDoc(userRef, { name: newName });
      setUserData({ ...userData, name: newName });
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
  if (!user || !userData) return <div className="no-user">No se encontró información del usuario</div>;

  return (
    <div className="user-profile">
      <header className="profile-header">
        <Link to="/" className="back-link"><i className="fas fa-arrow-left"></i> Volver al Inicio</Link>
        <h1>Perfil de Usuario</h1>
        <button onClick={handleLogout} className="logout-btn"><i className="fas fa-sign-out-alt"></i> Cerrar Sesión</button>
      </header>

      <main className="profile-content">
        <section className="user-info">
          <div className="user-avatar">
            <img 
              src={userData.photoURL || '/default-avatar.png'} 
              alt="Foto de perfil" 
              className="profile-image"
            />
          </div>
          <div className="user-details">
            {editMode ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="edit-name-input"
              />
            ) : (
              <h2>{userData.name}</h2>
            )}
            <p className="user-role"> {userData.role === 'admin' ? 'Administrador' : 'Estudiante'}</p>
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
