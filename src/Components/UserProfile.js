import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc, updateDoc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { signOut, updatePassword } from "firebase/auth";
import { db, auth } from "../firebase";
import "../styles/UserProfile.css";
import {
  FaCalendarAlt,
  FaCode,
  FaUsers,
  FaTicketAlt,
} from "react-icons/fa";

const TarjetaEvento = React.memo(({ evento, manejarDesuscripcion, contadorEventos }) => {
  const navigate = useNavigate();

  return (
    <div className="tarjeta-evento">
      <div className="evento-imagen" style={{ backgroundImage: `url(${evento.imagen})` }}></div>
      <div className="evento-contenido">
        <h3>{evento.nombre}</h3>
        <p><FaCalendarAlt /> {evento.fecha}</p>
        <p><FaCode /> {evento.categoria}</p>
        <p><FaUsers /> <strong>{contadorEventos[evento.id] || 0}</strong> suscripciones</p>
        <p><FaTicketAlt /> <strong>{evento.cuposDisponibles}</strong> cupos disponibles</p>
        <div className="evento-acciones">
          <button onClick={() => manejarDesuscripcion(evento.id)} className="btn-desuscribir">
            Cancelar Suscripción
          </button>
          <button onClick={() => navigate(`/foro/${evento.id}`)} className="btn-foro">
            Ir al Foro
          </button>
        </div>
      </div>
    </div>
  );
});

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
  const [newSuscripcion, setNewSuscripcion] = useState(null);
  const [contadorEventos, setContadorEventos] = useState({});

  useEffect(() => {
    // Fetch contadorEventos from Firestore
    const fetchContadorEventos = async () => {
      const eventosRef = collection(db, 'eventos');
      const eventosSnapshot = await getDocs(eventosRef);
      const contadorData = {};
      eventosSnapshot.forEach(doc => {
        contadorData[doc.id] = doc.data().contadorSuscripciones || 0;
      });
      setContadorEventos(contadorData);
    };
    fetchContadorEventos();
  }, []);

  const manejarDesuscripcion = useCallback(async (eventoId) => {
    try {
      const newSuscripciones = suscripciones.filter(evento => evento.id !== eventoId);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { suscripciones: newSuscripciones });
      setSuscripciones(newSuscripciones);

      // Update contadorEventos
      setContadorEventos(prev => ({
        ...prev,
        [eventoId]: (prev[eventoId] || 1) - 1
      }));

      // Update Firestore
      const eventoRef = doc(db, "eventos", eventoId);
      await updateDoc(eventoRef, {
        contadorSuscripciones: contadorEventos[eventoId] - 1,
        cuposDisponibles: (await getDoc(eventoRef)).data().cuposDisponibles + 1
      });
    } catch (error) {
      console.error("Error al desuscribirse del evento:", error);
    }
  }, [suscripciones, user, setSuscripciones, contadorEventos]);

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

  const manejarSuscripcion = useCallback((evento) => {
    setNewSuscripcion(evento);
  }, []);

  useEffect(() => {
    if (newSuscripcion) {
      setSuscripciones(prev => [...prev, newSuscripcion]);
      setNewSuscripcion(null);
    }
  }, [newSuscripcion, setSuscripciones]);

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
        <UserActions />
        <EventosSuscritos 
          suscripciones={sortedSuscripciones}
          manejarDesuscripcion={manejarDesuscripcion}
          contadorEventos={contadorEventos}
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

const EventosSuscritos = React.memo(({ suscripciones, manejarDesuscripcion, contadorEventos }) => (
  <section className="eventos-suscritos">
    <h2>Eventos Suscritos</h2>
    <div className="eventos-grid">
      {suscripciones.length > 0 ? (
        suscripciones.map((evento) => (
          <TarjetaEvento
            key={evento.id}
            evento={evento}
            manejarDesuscripcion={manejarDesuscripcion}
            contadorEventos={contadorEventos}
          />
        ))
      ) : (
        <p className="no-eventos">No estás suscrito a ningún evento.</p>
      )}
    </div>
  </section>
));

export default UserProfile;
