import React, { useState, useEffect } from "react";
import "../styles/UserProfile.css";

// Componente para mostrar información de cada evento
const TarjetaEvento = ({ evento, manejarFavorito, manejarCalificacion }) => (
  <div className="tarjeta-evento personalizada">
    <div className="imagen-evento" style={{ backgroundImage: `url(${evento.imagen})` }}>
      <div className="overlay">
        <h4 className="titulo-evento">{evento.nombre}</h4>
        <p className="fecha-evento">{evento.fecha}</p>
      </div>
    </div>
    <div className="info-evento">
      <p className="ubicacion-evento">📍 {evento.ubicacion}</p>
      <div className="calificacion">
        {[1, 2, 3, 4, 5].map((estrella) => (
          <span
            key={estrella}
            className={`estrella ${evento.calificacion >= estrella ? "calificada" : ""}`}
            onClick={() => manejarCalificacion(evento.id, estrella)}
          >
            ★
          </span>
        ))}
      </div>
      <button className="boton-ver-evento">ver evento</button>
    </div>
  </div>
);

const MiComponente = () => {
  const [eventos, setEventos] = useState([]);
  const [abierto, setAbierto] = useState(false);

  // Simulación de obtención de datos 
  useEffect(() => {
    const obtenerEventos = () => {
      const datosEventos = [
        {
          id: 1,
          nombre: "Festival Buen Ambiente",
          fecha: "Del 25 de noviembre al 18 de diciembre del 2025",
          ubicacion: "CAMINATA CHIA",
          imagen: "https://th.bing.com/th/id/OIP.bbBGKouF233E9fPnMTTxBAHaE8?w=296&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7",
          esFavorito: false,
          calificacion: 0,
        },
        {
          id: 2,
          nombre: "Taller de React",
          fecha: "12 de octubre del 2025",
          ubicacion: "Facultad de Ingeniería",
          imagen: "https://th.bing.com/th/id/OIP.bbBGKouF233E9fPnMTTxBAHaE8?w=296&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7",
          esFavorito: true,
          calificacion: 4,
        },
        
      ];
      setEventos(datosEventos);
    };

    obtenerEventos();
  }, []);

  // Maneja el cambio de estado de favorito
  const manejarFavorito = (id) => {
    setEventos((prev) =>
      prev.map((evento) =>
        evento.id === id ? { ...evento, esFavorito: !evento.esFavorito } : evento
      )
    );
  };

  // Maneja la calificación de un evento
  const manejarCalificacion = (id, calificacion) => {
    setEventos((prev) =>
      prev.map((evento) =>
        evento.id === id ? { ...evento, calificacion } : evento
      )
    );
  };

  // Función para abrir/cerrar la barra lateral
  const toggleSidebar = () => setAbierto(!abierto);

  return (
    <div className={`contenedor-principal ${abierto ? "sidebar-activo" : ""}`}>
      {/* Sidebar */}
      <div className={`sidebar ${abierto ? "abierto" : ""}`}>
        <div className="seccion1">
          <h3>Configuraciones</h3>
          <p>Ajusta tus preferencias y configuraciones de cuenta aquí.</p>
          <div className="lista-configuraciones">
            {/* Sección de botones de configuración */}
            <button className="boton-configuracion"><i className="fas fa-user-cog"></i> Editar perfil</button>
            <button className="boton-configuracion"><i className="fas fa-lock"></i> Cambiar contraseña</button>
            <button className="boton-configuracion"><i className="fas fa-bell"></i> Configurar notificaciones</button>
            <button className="boton-configuracion"><i className="fas fa-sign-out-alt"></i> Cerrar sesión</button>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="contenido-principal">
        <button onClick={toggleSidebar} className="boton-abrir-sidebar">
          <i className="fas fa-cog"></i>
        </button>

        {/* Información del perfil */}
        <div className="seccion2">
          <h3>Universidad Cundinamarca</h3>
          <div className="perfil">
            <img
              src="https://th.bing.com/th/id/OIP.GOJen5OQrmyG7FpS6BkOnAHaEK?w=292&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt="Perfil"
              className="imagen-perfil"
            />
            <div className="informacion-perfil">
              <div className="nombre-perfil">Usuario</div>
              <div className="rol-perfil">Estudiante</div>
            </div>
          </div>
          <div className="acciones-perfil">
            <button className="boton-perfil"><i className="fas fa-edit"></i> Editar perfil</button>
            <button className="boton-perfil"><i className="fas fa-cogs"></i> Ajustes</button>
          </div>
        </div>

        {/* Eventos Inscritos */}
        <div className="seccion4">
          <h3>Eventos Inscritos</h3>
          <div className="eventos">
            {eventos.map((evento) => (
              <TarjetaEvento
                key={evento.id}
                evento={evento}
                manejarFavorito={manejarFavorito}
                manejarCalificacion={manejarCalificacion}
              />
            ))}
          </div>
          <h3>Eventos favoritos</h3>
        </div>
      </div>
    </div>
  );
};

export default MiComponente;
