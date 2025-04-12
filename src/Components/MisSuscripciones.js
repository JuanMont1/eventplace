import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Carousel,
} from "react-bootstrap";
import "../styles/MisSuscripciones.css";
import { BarraNavegacion } from '../Components/BarraNavegacion';

import PieDePagina from '../Components/pieDePagina';

const MisSuscripciones = () => {
  const [eventos, setEventos] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const eventosEjemplo = [
      {
        id: 1,
        nombre: "Conferencia de Ingeniería",
        categoria: "Académico",
        imagen: "https://th.bing.com/th/id/OIP.28u0JEjQVvNlHpTgYMe_kAHaEK?w=290&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        fecha: "2023-12-15",
        facultad: "Ingeniería",
      },
      {
        id: 2,
        nombre: "Concierto de Jazz",
        categoria: "Cultural",
        imagen:
          "https://th.bing.com/th/id/OIP.VgM9fmeJxlvVFOgdIglp9wHaE8?rs=1&pid=ImgDetMain",
        fecha: "2023-12-20",
        facultad: "Artes",
      },
      {
        id: 3,
        nombre: "Torneo de Fútbol",
        categoria: "Deportivo",
        imagen:
          "https://th.bing.com/th/id/OIP.waotyyz8eQY87BvxuzYxWQHaEK?rs=1&pid=ImgDetMain",
        fecha: "2024-01-10",
        facultad: "Deportes",
      },
      {
        id: 4,
        nombre: "Taller de Programación",
        categoria: "Académico",
        imagen:
          "https://th.bing.com/th/id/OIP.VgM9fmeJxlvVFOgdIglp9wHaE8?rs=1&pid=ImgDetMain",
        fecha: "2024-01-15",
        facultad: "Ciencias de la Computación",
      },
      {
        id: 5,
        nombre: "Festival de Cine",
        categoria: "Cultural",
        imagen:
          "https://th.bing.com/th/id/OIP.VgM9fmeJxlvVFOgdIglp9wHaE8?rs=1&pid=ImgDetMain",
        fecha: "2024-02-01",
        facultad: "Comunicación",
      },
    ];
    setEventos(eventosEjemplo);

    const storedSuscripciones =
      JSON.parse(localStorage.getItem("suscripciones")) || [];
    setSuscripciones(storedSuscripciones);
  }, []);

  const toggleSuscripcion = (evento) => {
    setSuscripciones((prev) => {
      const newSuscripciones = prev.some((e) => e.id === evento.id)
        ? prev.filter((e) => e.id !== evento.id)
        : [...prev, evento];
      localStorage.setItem("suscripciones", JSON.stringify(newSuscripciones));
      return newSuscripciones;
    });
  };

  const eventosFiltrados = eventos.filter(
    (evento) =>
      evento.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      evento.categoria.toLowerCase().includes(filtro.toLowerCase()) ||
      evento.facultad.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <BarraNavegacion />
      
      <section className="bienvenida">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-4 mb-md-0">
              <h1 className="display-4 fw-bold">¡Bienvenido a EventPlace!</h1>
              <p className="lead">
                Descubre y suscríbete a los mejores eventos de la Universidad de Cundinamarca. 
                No te pierdas ninguna oportunidad de aprender, crecer y divertirte.
              </p>
              <Button variant="success" size="lg" className="rounded-pill px-4 py-2">
                Explorar Eventos
              </Button>
            </Col>
            <Col md={6}>
              <div className="imagen-container">
                <img 
                  src="https://noticias.udec.cl/wp-content/uploads/2022/09/CADEC-06-1024x683.jpg" 
                  alt="Eventos Universitarios" 
                  className="imagen-eventos"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sección 2: Carrusel  */}
      <section className="eventos-destacados">
        <Container>
          <h2 className="text-center mb-3">Eventos Destacados</h2>
          <p className="text-center mb-4">Descubre los eventos más emocionantes y populares de nuestra universidad</p>
          <Carousel fade controls={true} indicators={true} className="carrusel-container">
            {eventos.slice(0, 3).map((evento) => (
              <Carousel.Item key={evento.id}>
                <div className="carrusel-item">
                  <div className="carrusel-imagen-container">
                    <img
                      className="carrusel-imagen"
                      src={evento.imagen}
                      alt={evento.nombre}
                    />
                  </div>
                  <div className="carrusel-caption">
                    <h3>{evento.nombre}</h3>
                    <p>{evento.categoria} - {evento.facultad}</p>
                    <p className="evento-fecha">{evento.fecha}</p>
                    <Button variant="outline-light" className="mt-2">Ver más</Button>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      {/* Sección 4: Lista de Eventos  */}
      <section className="mis-suscripciones-container">
        <Container>
          <h2 className="text-center">Eventos disponibles</h2>
          <Form className="search-form mb-4">
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Buscar eventos..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </Form.Group>
          </Form>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {eventosFiltrados.map((evento) => (
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
                        className={suscripciones.some((e) => e.id === evento.id) ? "btn-cancelar" : "btn-suscribir"}
                        onClick={() => toggleSuscripcion(evento)}
                      >
                        {suscripciones.some((e) => e.id === evento.id)
                          ? "Cancelar suscripción"
                          : "Suscribirse"}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Sección 3: Video de Promoción */}
      <section className="video-eventos py-5">
        <Container fluid>
          <Row className="justify-content-center align-items-center">
            <Col lg={5} className="mb-4 mb-lg-0">
              <div className="video-info pe-lg-4">
                <h2 className="mb-4">Descubre la Experiencia EventPlace</h2>
                <p className="mb-4">Sumérgete en el mundo de eventos emocionantes que te esperan en la Universidad de Cundinamarca. Desde conferencias académicas hasta conciertos vibrantes, hay algo para todos.</p>
                <ul className="list-unstyled mb-4">
                  <li><i className="fas fa-check-circle text-success me-2"></i> Eventos académicos de primer nivel</li>
                  <li><i className="fas fa-check-circle text-success me-2"></i> Actividades culturales enriquecedoras</li>
                  <li><i className="fas fa-check-circle text-success me-2"></i> Oportunidades de networking</li>
                  <li><i className="fas fa-check-circle text-success me-2"></i> Experiencias únicas para estudiantes</li>
                </ul>
                <Button variant="success" size="lg" className="rounded-pill px-4 py-2">
                  ¡Suscríbete Ahora!
                </Button>
              </div>
            </Col>
            <Col lg={7}>
              <div className="video-container">
                <div className="ratio ratio-16x9 shadow-lg rounded overflow-hidden">
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Video promocional de EventPlace"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <PieDePagina />
    </div>
  );
};

export default MisSuscripciones;
