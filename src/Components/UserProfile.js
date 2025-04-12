import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/UserProfile.css";

// Informacion de cards
const TarjetaEvento = ({ evento, manejarCalificacion }) => (
  <div className="tarjeta-evento personalizada">
    <div className="imagen-evento" style={{ backgroundImage: `url(${evento.imagen})` }}>
      <div className="overlay">
        <h4 className="titulo-evento">{evento.nombre}</h4>
        <p className="fecha-evento">{evento.fecha}</p>
      </div>
    </div>
    <div className="info-evento">
      <p className="categoria-evento">🏷 {evento.categoria}</p>
      <p className="fecha-evento">📅 {evento.fecha}</p>
      <p className="facultad-evento">🏛 {evento.facultad}</p>
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
      <button className="boton-ver-evento">Ver evento</button>
    </div>
  </div>
);

const UserProfile = () => {
  const [suscripciones, setSuscripciones] = useState([]);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const storedSuscripciones = JSON.parse(localStorage.getItem('suscripciones')) || [];
    console.log('Suscripciones cargadas:', storedSuscripciones);
    // Filtrar suscripciones validas 
    const suscripcionesValidas = storedSuscripciones.filter(evento => 
      evento && evento.id && evento.nombre && evento.categoria && evento.fecha && evento.facultad
    );
    setSuscripciones(suscripcionesValidas);
  }, []);

  // Maneja la calificacin de cada suscripcion
  const manejarCalificacion = (id, calificacion) => {
    setSuscripciones(prevSuscripciones => {
      const newSuscripciones = prevSuscripciones.map(evento =>
        evento.id === id ? { ...evento, calificacion } : evento
      );
      
      localStorage.setItem('suscripciones', JSON.stringify(newSuscripciones));
      return newSuscripciones;
    });
  };

  // barra lateral
  const toggleSidebar = () => setAbierto(!abierto);

  return (
    <div className="user-profile-page">
      <Link to="/" className="volver-inicio">Volver al Inicio</Link>
      <div className={`contenedor-principal ${abierto ? "sidebar-activo" : ""}`}>
       
        <div className={`sidebar ${abierto ? "abierto" : ""}`}>
          <div className="seccion1">
            <h3>Configuraciones</h3>
            <p>Ajusta tus preferencias y configuraciones de cuenta aqu&iacute;.</p>
            <div className="lista-configuraciones">
             
              <button className="boton-configuracion"><i className="fas fa-user-cog"></i> Editar perfil</button>
              <button className="boton-configuracion"><i className="fas fa-lock"></i> Cambiar contrase&ntilde;a</button>
              <button className="boton-configuracion"><i className="fas fa-bell"></i> Configurar notificaciones</button>
              <button className="boton-configuracion"><i className="fas fa-sign-out-alt"></i> Cerrar sesi&oacute;n</button>
            </div>
          </div>
        </div>

        
        <div className="contenido-principal">
          <button onClick={toggleSidebar} className="boton-abrir-sidebar">
            <i className="fas fa-cog"></i>
          </button>

          
          <div className="seccion2">
            <h3>Universidad Cundinamarca</h3>
            <div className="perfil">
              <img
                src="https://th.bing.com/th/id/OIP.GOJen5OQrmyG7FpS6BkOnAHaEK?w=292&amp;h=180&amp;c=7&amp;r=0&amp;o=5&amp;dpr=1.3&amp;pid=1.7"
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

          {/* Eventos Suscritos */}
          <div className="seccion4">
            <h3>Eventos Suscritos</h3>
            <div className="eventos">
              {suscripciones.length > 0 ? (
                suscripciones.map((evento) => (
                  <TarjetaEvento
                    key={evento.id}
                    evento={evento}
                    manejarCalificacion={manejarCalificacion}
                  />
                ))
              ) : (
                <div className="mensaje-no-suscripciones">
                  No est&aacute;s suscrito a ning&uacute;n evento.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
