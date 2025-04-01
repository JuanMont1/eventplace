import React, { useState } from "react";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "Juan Pérez",
    faculty: "Ingeniería",
    email: "juan.perez@universidad.com",
    location: "Ciudad Universitaria",
    avatarUrl:
      "https://media.istockphoto.com/id/1766352902/es/v%C3%ADdeo/diversidad-de-personas-muchas-razas-diferentes-retrato-de-rostro-multi%C3%A9tnico-mezcla-humana.jpg?s=640x640&k=20&c=jJK56ZTa6OJ5eFLsMoIWd9M-YvuumhuE5b-69Q2MYEc=",
    eventsAttended: [
      {
        title: "Simposio de Innovación Tecnológica",
        rating: 4,
        description: "Excelente evento de aprendizaje y networking.",
      },
    ],
    eventsUpcoming: [
      {
        title: "Charla Académica sobre Inteligencia Artificial",
        rating: 1,
        description: "¡Estoy muy emocionado por asistir!",
      },
    ],
  });

  return (
    <div className="profile-container">
      {/* Encabezado del perfil */}
      <header className="profile-header">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/1/11/Logo_Universidad_de_Cundinamarca.png" 
          alt="Logo de la Universidad"
          className="logo"
        />
        <h1>Perfil de Usuario</h1>
      </header>

      {/* Contenido del perfil */}
      <div className="profile-content">
        <div className="user-info">
          <img
            src={user.avatarUrl}
            alt="Avatar del Usuario"
            className="avatar"
          />
          <h2>{user.name}</h2>
          <p><strong>Facultad:</strong> {user.faculty}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Ubicación:</strong> {user.location}</p>
          <button className="edit-profile-btn">Editar Perfil</button>
        </div>

        {/* Sección de eventos */}
        <div className="events-section">
          <h3>Eventos a los que asistí</h3>
          {user.eventsAttended.length === 0 ? (
            <p>No has asistido a ningún evento aún.</p>
          ) : (
            user.eventsAttended.map((event, index) => (
              <div className="event-card attended" key={index}>
                <h4>{event.title}</h4>
                <div className="rating">
                  {"⭐".repeat(event.rating)}
                  {"☆".repeat(5 - event.rating)}
                </div>
                <p>{event.description}</p>
              </div>
            ))
          )}

          <h3>Eventos a los que asistiré</h3>
          {user.eventsUpcoming.length === 0 ? (
            <p>No tienes eventos próximos programados.</p>
          ) : (
            user.eventsUpcoming.map((event, index) => (
              <div className="event-card upcoming" key={index}>
                <h4>{event.title}</h4>
                <div className="rating">
                  {"⭐".repeat(event.rating)}
                  {"☆".repeat(5 - event.rating)}
                </div>
                <p>{event.description}</p>
              </div>
            ))
          )}
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
