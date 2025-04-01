import React from "react";
import "../styles/UserProfile.css";

const UserProfile = () => {
  return (
    <div className="profile-container">
      {/* Encabezado del perfil */}
      <header className="profile-header">
        <img
          src="/logo.png" // Asegúrate de que esta ruta sea correcta
          alt="Logo de la Universidad"
          className="logo"
        />
        <h1>Perfil de Usuario</h1>
      </header>

      {/* Contenido del perfil */}
      <div className="profile-content">
        <div className="user-info">
          <img
            src="https://media.istockphoto.com/id/1766352902/es/v%C3%ADdeo/diversidad-de-personas-muchas-razas-diferentes-retrato-de-rostro-multi%C3%A9tnico-mezcla-humana.jpg?s=640x640&k=20&c=jJK56ZTa6OJ5eFLsMoIWd9M-YvuumhuE5b-69Q2MYEc=" // Imagen de avatar de muestra
            alt="Avatar del Usuario"
            className="avatar"
          />
          <h2>Usuario: Juan Pérez</h2>
          <p><strong>Facultad:</strong> Ingeniería</p>
        </div>

        {/* Sección de eventos */}
        <div className="events-section">
          <h3>Eventos a los que asistí</h3>
          <div className="event-card attended">
            <h4>Simposio de Innovación Tecnológica</h4>
            <div className="rating">⭐⭐⭐⭐</div>
            <p>Excelente evento de aprendizaje y networking.</p>
          </div>

          <h3>Eventos a los que asistiré</h3>
          <div className="event-card upcoming">
            <h4>Charla Académica sobre Inteligencia Artificial</h4>
            <div className="rating">⭐</div>
            <p>¡Estoy muy emocionado por asistir!</p>
          </div>
        </div>
      </div>

      {/* Botón de navegación */}
      <footer>
        <button className="prev-button">Anterior</button>
      </footer>
    </div>
  );
};

export default UserProfile;
