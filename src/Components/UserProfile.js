import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { signOut, updatePassword } from "firebase/auth";
import { db, auth } from "../firebase";
import "../styles/UserProfile.css";

const TarjetaEvento = React.memo(({ evento, manejarCalificacion }) => (
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
));

const useUserData = (user) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suscripciones, setSuscripciones] = useState([]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserData({ 
          id: user.uid, 
          ...data,
          photoURL: user.photoURL || data.photoURL || '/default-avatar.png'
        });
        const validSuscripciones = (data.suscripciones || []).filter(evento => 
          evento && evento.id && evento.nombre && evento.fecha && evento.categoria && evento.facultad
        );
        setSuscripciones(validSuscripciones);
      } else {
        setError("No se encontró el perfil del usuario");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { userData, loading, error, suscripciones, setSuscripciones };
};

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userData, loading, error, suscripciones, setSuscripciones } = useUserData(user);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const manejarCalificacion = useCallback(async (id, calificacion) => {
    try {
      const newSuscripciones = suscripciones.map((evento) =>
        evento.id === id ? { ...evento, calificacion } : evento
      );

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { suscripciones: newSuscripciones });
      setSuscripciones(newSuscripciones);
    } catch (error) {
      console.error("Error al actualizar la calificación:", error);
    }
  }, [suscripciones, user]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, [navigate]);

  const handleEditProfile = useCallback(() => {
    setEditMode(true);
    setNewName(userData?.name || "");
  }, [userData]);

  const handleSaveProfile = useCallback(async () => {
    try {
      const userRef = doc(db, "users", userData.id);
      await updateDoc(userRef, { name: newName });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }, [userData, newName]);

  const handleChangePassword = useCallback(async () => {
    try {
      await updatePassword(auth.currentUser, newPassword);
      alert("Password updated successfully!");
      setNewPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please try again.");
    }
  }, [newPassword]);

  const sortedSuscripciones = useMemo(() => 
    [...suscripciones].sort((a, b) => new Date(a.fecha) - new Date(b.fecha)),
    [suscripciones]
  );

  if (loading) return <div className="loading">Cargando perfil...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!user || !userData) return <div className="no-user">No se encontró información del usuario</div>;

  return (
    <div className="user-profile">
      <ProfileHeader handleLogout={handleLogout} />
      <main className="profile-content">
        <UserInfo 
          userData={userData}
          editMode={editMode}
          newName={newName}
          setNewName={setNewName}
          handleEditProfile={handleEditProfile}
          handleSaveProfile={handleSaveProfile}
        />
        <UserActions handleChangePassword={handleChangePassword} />
        <EventosSuscritos 
          suscripciones={sortedSuscripciones}
          manejarCalificacion={manejarCalificacion}
        />
      </main>
    </div>
  );
};

const ProfileHeader = React.memo(({ handleLogout }) => (
  <header className="profile-header">
    <Link to="/" className="back-link"><i className="fas fa-arrow-left"></i> Volver al Inicio</Link>
    <h1>Perfil de Usuario</h1>
    <button onClick={handleLogout} className="logout-btn"><i className="fas fa-sign-out-alt"></i> Cerrar Sesión</button>
  </header>
));

const UserInfo = React.memo(({ userData, editMode, newName, setNewName, handleEditProfile, handleSaveProfile }) => (
  <section className="user-info">
    <div className="user-avatar">
      <img src={userData.photoURL} alt="Foto de perfil" className="profile-image" />
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
      <p className="user-role">{userData.role === 'admin' ? 'Administrador' : 'Estudiante'}</p>
      {editMode ? (
        <button onClick={handleSaveProfile} className="save-btn">Guardar Cambios</button>
      ) : (
        <button onClick={handleEditProfile} className="edit-btn">Editar Perfil</button>
      )}
    </div>
  </section>
));

const UserActions = React.memo(({ handleChangePassword }) => (
  <section className="user-actions">
    <button onClick={handleChangePassword} className="action-btn">
      <i className="fas fa-key"></i> Cambiar Contraseña
    </button>
    <Link to="/mis-suscripciones" className="action-btn">
      <i className="fas fa-calendar-check"></i> Mis Suscripciones
    </Link>
  </section>
));

const EventosSuscritos = React.memo(({ suscripciones, manejarCalificacion }) => (
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
));

export default UserProfile;
