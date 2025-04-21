import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { FaGraduationCap, FaMusic, FaFootballBall, FaPalette, FaCode } from 'react-icons/fa';
import { getMockEventos } from '../mockData';

const EventosDisponibles = ({
  eventosFiltrados,
  categoriaSeleccionada,
  setCategoriaSeleccionada,
  filtro,
  setFiltro,
  isSuscrito,
  toggleSuscripcion,
}) => {
  const [eventos, setEventos] = useState([]);
  const [filtroLocal, setFiltroLocal] = useState('');
  const [categoria, setCategoria] = useState(null);
  const [suscripciones, setSuscripciones] = useState([]);

  // Usa eventosFiltrados si se proporciona, de lo contrario usa el estado local
  const eventosToShow = eventosFiltrados ?? eventos.filter(e =>
    (!categoria || e.categoria === categoria) &&
    (!filtroLocal || e.nombre.toLowerCase().includes(filtroLocal.toLowerCase()))
  );

  const isSuscritoLocal = (id) => suscripciones.includes(id);
  const toggleSuscripcionLocal = (evento) => {
    setSuscripciones((prev) =>
      prev.includes(evento.id)
        ? prev.filter(id => id !== evento.id)
        : [...prev, evento.id]
    );
  };

  useEffect(() => {
    const eventosMock = getMockEventos();
    setEventos(eventosMock);
  }, []);

  const categories = [
    { id: 1, name: 'Académico', icon: <FaGraduationCap />, color: '#4285F4' },
    { id: 2, name: 'Cultural', icon: <FaMusic />, color: '#EA4335' },
    { id: 3, name: 'Deportivo', icon: <FaFootballBall />, color: '#34A853' },
    { id: 4, name: 'Artístico', icon: <FaPalette />, color: '#FBBC05' },
    { id: 5, name: 'Tecnología', icon: <FaCode />, color: '#FF6D01' },
  ];

  return (
    <section className="mis-suscripciones-container">
      <Container>
        <h2 className="text-center">Eventos disponibles</h2>
        <div className="categories-container mb-4">
          {categories.map(category => (
            <div
              key={category.id}
              className={`category-item ${(
                categoriaSeleccionada ?? categoria
              ) === category.name ? 'selected' : ''}`}
              onClick={() => {
                setCategoriaSeleccionada
                  ? setCategoriaSeleccionada((prev) => prev === category.name ? null : category.name)
                  : setCategoria((prev) => prev === category.name ? null : category.name);
              }}
              style={{ backgroundColor: category.color }}
            >
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
        <Form className="search-form mb-4">
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Buscar eventos..."
              value={filtro ?? filtroLocal}
              onChange={(e) =>
                setFiltro
                  ? setFiltro(e.target.value)
                  : setFiltroLocal(e.target.value)
              }
            />
          </Form.Group>
        </Form>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {(eventosFiltrados ?? eventosToShow).map((evento) => (
            <Col key={evento.id}>
              <Card className="evento-card h-100">
                <Card.Img variant="top" src={evento.imagen} />
                <Card.Body>
                  <Card.Title>{evento.nombre}</Card.Title>
                  <Card.Text>
                    <strong>Categoría:</strong> {evento.categoria}
                    <br />
                    <strong>Fecha:</strong> {evento.fecha}
                    <br />
                    <strong>Facultad:</strong> {evento.facultad}
                  </Card.Text>
                  <div className="button-container">
                    <Button
                      className={
                        (isSuscrito ?? isSuscritoLocal)(evento.id)
                          ? 'btn-cancelar'
                          : 'btn-suscribir'
                      }
                      onClick={() =>
                        (toggleSuscripcion ?? toggleSuscripcionLocal)(evento)
                      }
                    >
                      {(isSuscrito ?? isSuscritoLocal)(evento.id)
                        ? 'Cancelar suscripción'
                        : 'Suscribirse'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default EventosDisponibles;
