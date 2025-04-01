import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import "../styles/CalendarSection.css";
import events from '../Components/DatosEventos';

console.log(events);

const CalendarSection = () => {
  const [selectedYear, setSelectedYear] = useState(2025); 
  const [selectedMonth, setSelectedMonth] = useState("Enero"); 

  const years = [2020, 2021, 2022, 2023, 2024, 2025] ;
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", 
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Función para manejar el clic en el mes
  const handleMonthClick = (month) => {
    setSelectedMonth(month); 
  };

  // Obtener eventos del año y mes seleccionados
  const currentMonthEvents = events[selectedYear]?.[selectedMonth] || [];

  return (
    <div className="calendar-section">
      <div className="image-container" onClick={() => window.location.href = 'https://www.ejemplo.com'}>
        <img src="/logo.png" alt="Imagen Hover" />
      </div>

      <div className="calendar-header">
        <h2>CALENDARIO</h2>

        <div className="year-selector">
          <select
            className="year-dropdown"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="quote">
          "Los eventos son momentos que nos permiten conectar con el presente, crear recuerdos y construir historias que compartimos con los demás."
        </div>
      </div>

      <div className="months-container">
        {months.map((month) => (
          <div
            className="month"
            key={month}
            onClick={() => handleMonthClick(month)}
          >
            <FaCalendarAlt className="calendar-icon" />
            <span>{month}</span>
          </div>
        ))}
      </div>

      {/* Sección de eventos */}
      {currentMonthEvents.length > 0 ? (
        <div className="events-section">
          <h3>Eventos de {selectedMonth} {selectedYear}</h3>
          <div className="events-container">
            {currentMonthEvents.map((event, index) => (
              <div className="event-card" key={index}>
                <h4>{event.title}</h4>
                <p><strong>Fecha:</strong> {event.date}</p>
                <p>{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No hay eventos para este mes.</p>
      )}
    </div>
  );
};

export default CalendarSection;
