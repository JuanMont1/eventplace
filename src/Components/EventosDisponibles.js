import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { FaGraduationCap, FaMusic, FaFootballBall, FaPalette, FaCode } from 'react-icons/fa';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const categories = [
  { id: 1, name: 'Académico', icon: <FaGraduationCap />, color: '#4285F4' },
  { id: 2, name: 'Cultural', icon: <FaMusic />, color: '#EA4335' },
  { id: 3, name: 'Deportivo', icon: <FaFootballBall />, color: '#34A853' },
  { id: 4, name: 'Artístico', icon: <FaPalette />, color: '#FBBC05' },
  { id: 5, name: 'Tecnología', icon: <FaCode />, color: '#FF6D01' },
];

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
  const [categoriaLocal, setCategoriaLocal] = useState(null);

  useEffect(() => {
    const eventosCollection = collection(db, 'eventos');
    const unsubscribe = onSnapshot(eventosCollection, (snapshot) => {
      const eventosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEventos(eventosData);
    });

    return () => unsubscribe();
  }, []);

  const eventosToShow = useMemo(() => {
    const eventosBase = eventosFiltrados ?? eventos;
    const categoriaActual = categoriaSeleccionada ?? categoriaLocal;
    const filtroActual = filtro ?? filtroLocal;

    return eventosBase.filter(e =>
      (!categoriaActual || e.categoria === categoriaActual) &&
      (!filtroActual || e.nombre.toLowerCase().includes(filtroActual.toLowerCase()))
    );
  }, [eventosFiltrados, eventos, categoriaSeleccionada, categoriaLocal, filtro, filtroLocal]);

  const handleCategoriaClick = (categoryName) => {
    if (setCategoriaSeleccionada) {
      setCategoriaSeleccionada(prev => prev === categoryName ? null : categoryName);
    } else {
      setCategoriaLocal(prev => prev === categoryName ? null : categoryName);
    }
  };

  const handleFiltroChange = (e) => {
    const value = e.target.value;
    if (setFiltro) {
      setFiltro(value);
    } else {
      setFiltroLocal(value);
    }
  };

  return (
    <section className="mis-suscripciones-container">
      <Container>
        <h2 className="text-center">Eventos disponibles</h2>
        <div className="categories-container mb-4">
          {categories.map(category => (
            <div
              key={category.id}
              className={`category-item ${(categoriaSeleccionada ?? categoriaLocal) === category.name ? 'selected' : ''}`}
              onClick={() => handleCategoriaClick(category.name)}
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
              onChange={handleFiltroChange}
            />
          </Form.Group>
        </Form>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {eventosToShow.map((evento) => (
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
                      className={isSuscrito(evento.id) ? 'btn-cancelar' : 'btn-suscribir'}
                      onClick={() => toggleSuscripcion(evento)}
                    >
                      {isSuscrito(evento.id) ? 'Cancelar suscripción' : 'Suscribirse'}
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
