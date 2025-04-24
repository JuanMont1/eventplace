import React from 'react';
import '../../styles/pieDePagina.css'; 
import '@fortawesome/fontawesome-free/css/all.css';

const PieDePagina = () => {
  return (
    <footer className="pie">
      <div className="seccion-pie">
        <h3 className="titulo-pie">Enlaces Rápidos</h3>
        <ul className="lista-pie">
          <li className="item-lista-pie"><a href="/eventos" className="enlace-pie">Eventos</a></li>
          <li className="item-lista-pie"><a href="/calendario" className="enlace-pie">Calendario</a></li>
          <li className="item-lista-pie"><a href="/registro" className="enlace-pie">Registro</a></li>
          <li className="item-lista-pie"><a href="/contacto" className="enlace-pie">Contacto</a></li>
        </ul>
      </div>

      <div className="centro-pie">
        <img src="/logo.png" alt="Logo UdeC" className="logo-pie" />
        <h2 className="titulo-pie">Universidad de Cundinamarca</h2>
        <p>Innovación, Excelencia y Compromiso</p>
        <div className="iconos-redes-pie">
          <a href="https://www.facebook.com/UdeC" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
          <a href="https://www.instagram.com/UdeC" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="https://www.twitter.com/UdeC" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="https://www.youtube.com/UdeC" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
        </div>
      </div>

      <div className="seccion-pie">
        <h3 className="titulo-pie">Contacto</h3>
        <ul className="lista-pie">
          <li className="item-lista-pie"><i className="fas fa-map-marker-alt"></i> Dirección, Ciudad, Colombia</li>
          <li className="item-lista-pie"><i className="fas fa-phone"></i> +57 (1) 234-5678</li>
          <li className="item-lista-pie"><i className="fas fa-envelope"></i> info@udec.edu.co</li>
        </ul>
      </div>
    </footer>
  );
};

export default PieDePagina;
