import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import "../styles/CalendarSection.css";

const CalendarSection = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const years = [2024, 2025, 2026, 2027, 2028];

  return (
    <div className="calendar-section">
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
          "Los eventos son momentos que nos permiten conectar con el presente,
          crear recuerdos y construir historias que compartimos con los demás."
        </div>
      </div>

      <div className="months-container">
        {["Enero", "Febrero", "Marzo", "Abril", "Julio"].map((month) => (
          <div className="month" key={month}>
            <FaCalendarAlt className="calendar-icon" />
            <span>{month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarSection;
