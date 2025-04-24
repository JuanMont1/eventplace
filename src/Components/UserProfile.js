import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEventos } from "../contexts/EventosContext";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import "../styles/UserProfile.css";
import {
  FaCalendarAlt,
  FaCode,
  FaUsers,
  FaTicketAlt,
} from "react-icons/fa";

const TarjetaEvento = React.memo(({ evento, manejarDesuscripcion }) => {
  const navigate = useNavigate();
  const [eventoActualizado, setEventoActualizado] = useState(evento);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "eventos", evento.id), (doc) => {
      if (doc.exists()) {
        setEventoActualizado({ ...doc.data(), id: doc.id });
      }
    });

    return () => unsubscribe();
  }, [evento.id]);

  return (
    <div className="tarjeta-evento">
      <div className="evento-imagen" style={{ backgroundImage: `url(${eventoActualizado.imagen})` }}></div>
      <div className="evento-contenido">
        <h3>{eventoActualizado.nombre}</h3>
        <p><FaCalendarAlt /> {eventoActualizado.fecha}</p>
        <p><FaCode /> {eventoActualizado.categoria}</p>
        <p><FaUsers /> <strong>{Object.keys(eventoActualizado.suscripciones || {}).length}</strong> suscripciones</p>
        <p><FaTicketAlt /> <strong>{eventoActualizado.cuposDisponibles}</strong> cupos disponibles</p>
        <div className="evento-acciones">
          <button onClick={() => manejarDesuscripcion(eventoActualizado.id)} className="btn-desuscribir">
            Cancelar Suscripción
          </button>
          <button onClick={() => navigate(`/foro/${eventoActualizado.id}`)} className="btn-foro">
            Ir al Foro
          </button>
        </div>
      </div>
    </div>
  );
});

const UserProfile = () => {
  const { user } = useAuth();
  const { suscripciones, eventosDisponibles, toggleSuscripcion } = useEventos();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");

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
    setNewName(user?.displayName || "");
  }, [user]);

  const handleSaveProfile = useCallback(async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { name: newName });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }, [user, newName]);

  const manejarDesuscripcion = useCallback(async (eventoId) => {
    const evento = eventosDisponibles.find(e => e.id === eventoId);
    if (evento) {
      await toggleSuscripcion(evento);
    }
  }, [eventosDisponibles, toggleSuscripcion]);

  const sortedSuscripciones = useMemo(() => 
    [...suscripciones].sort((a, b) => new Date(a.fecha) - new Date(b.fecha)),
    [suscripciones]
  );

  if (!user) return <div className="no-user">No se encontró información del usuario</div>;

  return (
    <div className="user-profile">
      <ProfileHeader handleLogout={handleLogout} />
      <main className="profile-content">
        <UserInfo 
          userData={user}
          editMode={editMode}
          newName={newName}
          setNewName={setNewName}
          handleEditProfile={handleEditProfile}
          handleSaveProfile={handleSaveProfile}
        />
        <UserActions />
        <EventosSuscritos 
          suscripciones={sortedSuscripciones}
          manejarDesuscripcion={manejarDesuscripcion}
          eventosDisponibles={eventosDisponibles}
        />
      </main>
    </div>
  );
};

const ProfileHeader = React.memo(({ handleLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="profile-header">
      <button onClick={() => navigate(-1)} className="back-link">
        <i className="fas fa-arrow-left"></i> Volver
      </button>
      <h1>Perfil de Usuario</h1>
      <button onClick={handleLogout} className="logout-btn">
        <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>
    </header>
  );
});

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

const UserActions = React.memo(() => (
  <section className="user-actions">
    <Link to="/mis-suscripciones" className="action-btn">
      <i className="fas fa-calendar-check"></i> Mis Suscripciones
    </Link>
    <Link to="/reservado" className="action-btn">
      <i className="fas fa-bookmark"></i> Reservado
    </Link>
  </section>
));

const EventosSuscritos = React.memo(({ suscripciones, manejarDesuscripcion, eventosDisponibles }) => (
  <section className="eventos-suscritos">
    <h2>Eventos Suscritos</h2>
    <div className="eventos-grid">
      {suscripciones.length > 0 ? (
        suscripciones.map((evento) => {
          const eventoCompleto = eventosDisponibles.find(e => e.id === evento.id) || evento;
          return (
            <TarjetaEvento
              key={evento.id}
              evento={eventoCompleto}
              manejarDesuscripcion={manejarDesuscripcion}
            />
          );
        })
      ) : (
        <p className="no-eventos">No estás suscrito a ningún evento.</p>
      )}
    </div>
  </section>
));

export default UserProfile;