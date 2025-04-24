import React from 'react';
import CalendarSection from "../Components/calendario/CalendarSection";
import Slider from "../Components/Slider";
import Eventos from "../Components/eventos/Eventos";

const PaginaCalendario = () => {
  return (
    <div className="main-content">
      <CalendarSection />
      <Slider />
      <Eventos />
    </div>
  );
};

export default PaginaCalendario;