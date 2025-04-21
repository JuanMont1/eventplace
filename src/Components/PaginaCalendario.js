import React from 'react';
import CalendarSection from "./CalendarSection";
import Slider from "./Slider";
import Eventos from './Eventos';

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