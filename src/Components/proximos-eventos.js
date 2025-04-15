import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { FaClock, FaMapMarkerAlt, FaSearch, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/ProximosEventos.css";

const ProximosEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Simular la obtención de datos (esto deberías hacerlo desde una base de datos o API)
    setEventos([
      { id: 1, nombre: "Conferencia de Ciencia", fecha: "2025-04-20", hora: "14:00", lugar: "Auditorio Principal", categoria: "Académicos", imagen: "https://noticias.udec.cl/wp-content/uploads/2022/09/CADEC-06-1024x683.jpg", descripcion: "Una fascinante conferencia sobre los últimos avances científicos." },
      { id: 2, nombre: "Torneo de Fútbol", fecha: "2025-04-22", hora: "10:00", lugar: "Campo Deportivo", categoria: "Deportivos", imagen: "https://noticias.udec.cl/wp-content/uploads/2022/09/CADEC-06-1024x683.jpg", descripcion: "Emocionante torneo de fútbol entre facultades." },
      { id: 3, nombre: "Festival Cultural", fecha: "2025-04-25", hora: "18:00", lugar: "Plaza Central", categoria: "Culturales", imagen: "https://noticias.udec.cl/wp-content/uploads/2022/09/CADEC-06-1024x683.jpg", descripcion: "Celebra la diversidad cultural con música, danza y gastronomía." },
      { id: 4, nombre: "Seminario de Innovación", fecha: "2025-05-05", hora: "09:00", lugar: "Sala de Conferencias", categoria: "Académicos", imagen: "https://noticias.udec.cl/wp-content/uploads/2022/09/CADEC-06-1024x683.jpg", descripcion: "Descubre las últimas tendencias en innovación y tecnología." },
    ]);
  }, []);

  const eventosFiltrados = eventos.filter((evento) =>
    evento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    evento.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="proximos-eventos-page">
      <Button 
        variant="link" 
        className="btn-volver" 
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Volver
      </Button>

      <div className="hero-section">
        <h1>Descubre el Futuro en la UdeC</h1>
        <p>Explora los eventos que darán forma a tu experiencia universitaria</p>
      </div>

      <Container fluid className="proximos-eventos-container">
        <Row className="mb-4 justify-content-center">
          <Col md={6}>
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Busca tu próximo evento..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
              />
            </div>
          </Col>
        </Row>

        <div className="timeline-container">
          {eventosFiltrados.map((evento, index) => (
            <div key={evento.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-content">
                <div className="evento-fecha">{evento.fecha}</div>
                <h3 className="evento-titulo">{evento.nombre}</h3>
                <p className="evento-descripcion">{evento.descripcion}</p>
                <div className="evento-detalles">
                  <p><FaClock /> {evento.hora}</p>
                  <p><FaMapMarkerAlt /> {evento.lugar}</p>
                </div>
                <Button variant="outline-primary" className="btn-mas-info">Más información</Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default ProximosEventos;
