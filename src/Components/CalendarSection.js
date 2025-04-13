import React, { useState } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
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

  const changeMonth = (direction) => {
    const currentIndex = months.indexOf(selectedMonth);
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % 12;
    } else {
      newIndex = (currentIndex - 1 + 12) % 12;
    }
    setSelectedMonth(months[newIndex]);
  };

  return (
    <div className="calendar-section">
      <div className="calendar-header">
        <h2>Calendario</h2>

        <div className="year-selector">
          <select
            className="year-dropdown"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
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

      <div className="month-navigator">
        <button onClick={() => changeMonth('prev')} className="nav-button">
          <FaChevronLeft />
        </button>
        <h3>{selectedMonth}</h3>
        <button onClick={() => changeMonth('next')} className="nav-button">
          <FaChevronRight />
        </button>
      </div>

      <div className="months-container">
        {months.map((month) => (
          <div
            className={`month ${month === selectedMonth ? 'active' : ''}`}
            key={month}
            onClick={() => handleMonthClick(month)}
          >
            <FaCalendarAlt className="calendar-icon" />
            <span>{month.substring(0, 3)}</span>
          </div>
        ))}
      </div>

      {/* Sección de eventos */}
      <div className="events-section">
        {currentMonthEvents.length > 0 ? (
          <>
            <h3>Eventos de {selectedMonth} {selectedYear}</h3>
            <div className="events-container">
              {currentMonthEvents.map((event, index) => (
                <div className="event-card" key={index}>
                  <div className="event-header">
                    <h4>{event.title}</h4>
                    <span className="event-date">{event.date}</span>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-footer">
                    <span className="event-location">{event.location}</span>
                    <button className="event-details-btn">Ver detalles</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="no-events">No hay eventos para este mes.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarSection;
