import React from 'react';
import '../styles/Footer.css'; 
import '@fortawesome/fontawesome-free/css/all.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h2>EVENTOS UDEC</h2>
        <ul>
          <li>EVENTOS UDEC</li>
          <li>EVENTOS UDEC</li>
          <li>EVENTOS UDEC</li>
        </ul>
      </div>
      <div className="footer-center">
        <img src="/public/logo.png" alt="UdeC Logo" className="logo" />
        <h2>UdeC</h2>
        <p>UNIVERSIDAD DE CUNDINAMARCA</p>
        <div className="social-icons">
          <a href="https://www.facebook.com/UdeC"><i className="fab fa-facebook"></i></a>
          <a href="https://www.instagram.com/UdeC"><i className="fab fa-instagram"></i></a>
          <a href="https://www.twitter.com/UdeC"><i className="fab fa-twitter"></i></a>
          <a href="https://www.youtube.com/UdeC"><i className="fab fa-youtube"></i></a>
        </div>
      </div>
      <div className="footer-section">
        <h2>EVENTOS UDEC</h2>
        <ul>
          <li>EVENTOS UDEC</li>
          <li>EVENTOS UDEC</li>
          <li>EVENTOS UDEC</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
