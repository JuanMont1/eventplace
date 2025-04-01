import React from 'react';
import '../styles/EventSection.css';

const EventSection = () => {
  const events = [
    {
      id: 1,
      title: 'Concierto Sinfónico',
      date: '2025-04-15',
      description: 'Disfruta de una noche mágica con música sinfónica en vivo.',
    },
    {
      id: 2,
      title: 'Feria de Emprendimiento',
      date: '2025-05-01',
      description: 'Explora ideas innovadoras y conecta con emprendedores.',
    },
    {
      id: 3,
      title: 'Taller de Programación',
      date: '2025-06-10',
      description: 'Aprende a desarrollar aplicaciones web con expertos.',
    }, {

    id: 4,
      title: 'Concierto Sinfónico',
      date: '2025-04-15',
      description: 'Disfruta de una noche mágica con música sinfónica en vivo.',
    },
    {
      id: 5,
      title: 'Feria de Emprendimiento',
      date: '2025-05-01',
      description: 'Explora ideas innovadoras y conecta con emprendedores.',
    },
    {
      id: 6,
      title: 'Taller de Programación',
      date: '2025-06-10',
      description: 'Aprende a desarrollar aplicaciones web con expertos.',
    },
  ];

  return (
    <div className="main-container">
      <section className="event-section">
        <h1>Eventos Destacados</h1>
        <div className="event-list">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <h2>{event.title}</h2>
              <p><strong>Fecha:</strong> {event.date}</p>
              <p>{event.description}</p>
              <button className="details-btn">Ver detalles</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventSection;