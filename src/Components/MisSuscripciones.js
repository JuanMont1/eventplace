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
import { FaGraduationCap, FaMusic, FaFootballBall, FaPalette, FaCode } from 'react-icons/fa';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { getMockEventos } from '../mockData';
import EventosDisponibles from '../Components/EventosDisponibles'; // Asegúrate que esta ruta esté bien

const MisSuscripciones = () => {
  const [eventosDisponibles, setEventosDisponibles] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [user, setUser] = useState(null);

  const categories = [
    { id: 1, name: 'Académico', icon: <FaGraduationCap />, color: '#4285F4' },
    { id: 2, name: 'Cultural', icon: <FaMusic />, color: '#EA4335' },
    { id: 3, name: 'Deportivo', icon: <FaFootballBall />, color: '#34A853' },
    { id: 4, name: 'Artístico', icon: <FaPalette />, color: '#FBBC05' },
    { id: 5, name: 'Tecnología', icon: <FaCode />, color: '#FF6D01' },
  ];

  useEffect(() => {
    const fetchEventos = async () => {
      // Obtener eventos mock
      const eventosMock = getMockEventos();
      
      // Si tienes eventos de Firebase, puedes combinarlos aquí
      // const eventosFirebase = await fetchEventosFromFirebase();
      // const todosLosEventos = [...eventosMock, ...eventosFirebase];

      setEventosDisponibles(eventosMock);
    };

    fetchEventos();

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribeUser = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setSuscripciones(doc.data().suscripciones || []);
          } else {
            setSuscripciones([]);
          }
        });
        return () => unsubscribeUser();
      } else {
        setSuscripciones([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleSuscripcion = async (evento) => {
    if (!user) {
      alert("Por favor, inicia sesión para suscribirte a eventos.");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    try {
      const userSnap = await getDoc(userRef);
      let currentSuscripciones = userSnap.exists() ? (userSnap.data().suscripciones || []) : [];

      if (currentSuscripciones.some(e => e.id === evento.id)) {
        currentSuscripciones = currentSuscripciones.filter(e => e.id !== evento.id);
      } else {
        currentSuscripciones.push(evento);
      }

      await setDoc(userRef, { suscripciones: currentSuscripciones }, { merge: true });
      setSuscripciones(currentSuscripciones);
    } catch (error) {
      console.error("Error al actualizar suscripciones:", error);
    }
  };

  const eventosFiltrados = eventosDisponibles.filter(
    (evento) =>
      (categoriaSeleccionada ? evento.categoria === categoriaSeleccionada : true) &&
      (evento.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        evento.categoria.toLowerCase().includes(filtro.toLowerCase()) ||
        evento.facultad.toLowerCase().includes(filtro.toLowerCase()))
  );

  const isSuscrito = (eventoId) => {
    return suscripciones.some(e => e.id === eventoId);
  };

  return (
    <div>
      <BarraNavegacion />

      {/* Sección 1: Bienvenida */}
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

      {/* Sección 2: Carrusel */}
      <section className="eventos-destacados">
        <Container>
          <h2 className="text-center mb-3">Eventos Destacados</h2>
          <p className="text-center mb-4">Descubre los eventos más emocionantes y populares de nuestra universidad</p>
          <Carousel fade controls indicators className="carrusel-container">
            {eventosDisponibles.slice(0, 3).map((evento) => (
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

      {/* Sección 3: Lista de Eventos Filtrados */}
      <EventosDisponibles 
        eventosFiltrados={eventosFiltrados}
        categoriaSeleccionada={categoriaSeleccionada}
        setCategoriaSeleccionada={setCategoriaSeleccionada}
        filtro={filtro}
        setFiltro={setFiltro}
        isSuscrito={isSuscrito}
        toggleSuscripcion={toggleSuscripcion}
      />

      {/* Sección 4: Video Promocional */}
      <section className="video-eventos py-5">
        <Container fluid>
          <Row className="justify-content-center align-items-center">
            <Col lg={5} className="mb-4 mb-lg-0">
              <div className="video-info pe-lg-4">
                <h2 className="mb-4">Descubre la Experiencia EventPlace</h2>
                <p className="mb-4">
                  Sumérgete en el mundo de eventos emocionantes que te esperan en la Universidad de Cundinamarca. Desde conferencias académicas hasta conciertos vibrantes, hay algo para todos.
                </p>
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
    </div>
  );
};

export default MisSuscripciones;
