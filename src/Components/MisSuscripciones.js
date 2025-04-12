import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import '../styles/MisSuscripciones.css';

const MisSuscripciones = () => {
  const [eventos, setEventos] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const eventosEjemplo = [
      { id: 1, nombre: 'Conferencia de Ingeniería', categoria: 'Académico', imagen: 'https://th.bing.com/th/id/OIP.VgM9fmeJxlvVFOgdIglp9wHaE8?rs=1&pid=ImgDetMain', fecha: '2023-12-15', facultad: 'Ingeniería' },
      { id: 2, nombre: 'Concierto de Jazz', categoria: 'Cultural', imagen: 'https://th.bing.com/th/id/OIP.VgM9fmeJxlvVFOgdIglp9wHaE8?rs=1&pid=ImgDetMain', fecha: '2023-12-20', facultad: 'Artes' },
      { id: 3, nombre: 'Torneo de Fútbol', categoria: 'Deportivo', imagen: 'https://th.bing.com/th/id/OIP.VgM9fmeJxlvVFOgdIglp9wHaE8?rs=1&pid=ImgDetMain', fecha: '2024-01-10', facultad: 'Deportes' },
      { id: 4, nombre: 'Taller de Programación', categoria: 'Académico', imagen: 'https://th.bing.com/th/id/OIP.VgM9fmeJxlvVFOgdIglp9wHaE8?rs=1&pid=ImgDetMain', fecha: '2024-01-15', facultad: 'Ciencias de la Computación' },
      { id: 5, nombre: 'Festival de Cine', categoria: 'Cultural', imagen: 'https://th.bing.com/th/id/OIP.VgM9fmeJxlvVFOgdIglp9wHaE8?rs=1&pid=ImgDetMain', fecha: '2024-02-01', facultad: 'Comunicación' },
    ];
    setEventos(eventosEjemplo);

    // Cargar suscripciones del localStorage
    const storedSuscripciones = JSON.parse(localStorage.getItem('suscripciones')) || [];
    setSuscripciones(storedSuscripciones);
  }, []);

  const toggleSuscripcion = (evento) => {
    setSuscripciones(prevSuscripciones => {
      let newSuscripciones;
      if (prevSuscripciones.some(e => e.id === evento.id)) {
        newSuscripciones = prevSuscripciones.filter(e => e.id !== evento.id);
      } else {
        newSuscripciones = [...prevSuscripciones, evento];
      }
      // Guardar en localStorage
      localStorage.setItem('suscripciones', JSON.stringify(newSuscripciones));
      return newSuscripciones;
    });
  };

  const eventosFiltrados = eventos.filter(evento =>
    evento.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    evento.categoria.toLowerCase().includes(filtro.toLowerCase()) ||
    evento.facultad.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Container className="mis-suscripciones-container">
      <h1 className="text-center mb-4">Mis Suscripciones</h1>
      <Form className="mb-4">
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Buscar eventos..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </Form.Group>
      </Form>
      <Row>
        {eventosFiltrados.map(evento => (
          <Col key={evento.id} md={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={evento.imagen} />
              <Card.Body>
                <Card.Title>{evento.nombre}</Card.Title>
                <Card.Text>
                  Categoría: {evento.categoria}<br/>
                  Fecha: {evento.fecha}<br/>
                  Facultad: {evento.facultad}
                </Card.Text>
                <Button
                  variant={suscripciones.some(e => e.id === evento.id) ? "danger" : "primary"}
                  onClick={() => toggleSuscripcion(evento)}
                >
                  {suscripciones.some(e => e.id === evento.id) ? "Cancelar suscripción" : "Suscribirse"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MisSuscripciones;