import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Carousel, Alert, Modal } from 'react-bootstrap';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaBullhorn, FaArrowRight, FaCalendar, FaUniversity, FaQuoteLeft, FaQuoteRight, FaStar, FaPaperPlane, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/PaginaPrincipal.css';
import CountUp from 'react-countup';
import welcomeGif from '../archivos/img/abeja.gif';
import { BarraNavegacion } from './BarraNavegacion';


const Hero = () => {
  return (
    <div className="hero-wrapper">
    <motion.section 
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Container fluid className="hero-container">
        <Row className="align-items-center">
          <Col md={6} className="hero-content">
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Bienvenido a EventPlace
            </motion.h1>
            <motion.p
              className="hero-subtitle"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Tu puerta de entrada a experiencias universitarias inolvidables
            </motion.p>
            <motion.p
              className="hero-description"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Descubre, participa y crea momentos que definirán tu vida universitaria
            </motion.p>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button variant="light" size="lg" className="hero-button">Explora Eventos</Button>
            </motion.div>
          </Col>
          <Col md={6} className="hero-gif-container">
            <img src={welcomeGif} alt="Bienvenida a EventPlace" className="hero-gif" />
          </Col>
        </Row>
      </Container>
    </motion.section>
    </div>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date("2025-12-31T23:59:59").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section 
      className="countdown-timer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Pr&oacute;ximo Evento Grande</h2>
      <div className="timer">
        {Object.entries(timeLeft).map(([key, value]) => (
          <div key={key} className="time-segment">
            <span className="time">{value.toString().padStart(2, '0')}</span>
            <span className="label">{key}</span>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

const CampusMap = () => {
  return (
    <div className="campus-map-container">
      <div className="campus-map-content">
        <h2>Mapa de los eventos</h2>
        <h3>Observa los lugares en los que se har&aacute;n los eventos</h3>
      </div>
      <div className="campus-map">
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: '600px', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              Ubicaci&oacute;n del pr&oacute;ximo evento
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

const CampusMapSection = () => {
  return (
    <section className="campus-map-section">
      
      <CampusMap />
    </section>
  );
};

const EventosDestacados = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const eventos = [
    {
      titulo: 'Feria de Ciencias',
      descripcion: 'Explora los &uacute;ltimos avances cient&iacute;ficos presentados por nuestros estudiantes.',
      fecha: '15 de Mayo, 2023',
      lugar: 'Campus Principal',
      participantes: '500+',
      imagen: 'https://th.bing.com/th/id/OIP.bxEmtJCnIVC-Kl1bpxSfsAHaHa?w=175&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
    },
    {
      titulo: 'Concierto de Primavera',
      descripcion: 'Disfruta de una noche m&aacute;gica con las mejores bandas estudiantiles.',
      fecha: '22 de Mayo, 2023',
      lugar: 'Auditorio Central',
      participantes: '1000+',
      imagen: 'https://th.bing.com/th/id/OIP.bxEmtJCnIVC-Kl1bpxSfsAHaHa?w=175&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
    },
    {
      titulo: 'Hackathon Anual',
      descripcion: '24 horas de innovaci&oacute;n y programaci&oacute;n para resolver desaf&iacute;os reales.',
      fecha: '5-6 de Junio, 2023',
      lugar: 'Centro de Innovaci&oacute;n',
      participantes: '200',
      imagen: 'https://th.bing.com/th/id/OIP.bxEmtJCnIVC-Kl1bpxSfsAHaHa?w=175&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
    }
  ];

  const handleShowModal = (evento) => {
    setSelectedEvent(evento);
    setShowModal(true);
  };

  return (
    <motion.section 
      className="eventos-destacados-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="eventos-hero">
        <div className="eventos-hero-content">
          <h2>Eventos Destacados</h2>
          <p className="eventos-hero-subtitle">Descubre experiencias &uacute;nicas que marcar&aacute;n tu vida universitaria</p>
        </div>
      </div>
      <div className="eventos-container">
        <div className="eventos-galeria">
          {eventos.map((evento, index) => (
            <motion.div 
              key={index} 
              className="evento-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="evento-imagen" style={{ backgroundImage: `url(${evento.imagen})` }}></div>
              <div className="evento-contenido">
                <h3>{evento.titulo}</h3>
                <p>{evento.descripcion}</p>
                <div className="evento-detalles">
                  <p><FaCalendarAlt /> {evento.fecha}</p>
                  <p><FaMapMarkerAlt /> {evento.lugar}</p>
                  <p><FaUsers /> {evento.participantes} participantes</p>
                </div>
                <Button onClick={() => handleShowModal(evento)} className="btn-ver-mas">Ver m&aacute;s</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent?.titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedEvent?.descripcion}</p>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>&iquest;Quieres asistir a este evento? Ingresa tu correo</Form.Label>
              <Form.Control type="email" placeholder="tu@email.com" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Registrarme
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </motion.section>
  );
};

const CalendarioResumen = () => {
  const proximosEventos = [
    {
      fecha: '15 Mayo',
      titulo: 'Seminario de Investigaci&oacute;n',
      hora: '14:00 - 17:00',
      lugar: 'Auditorio Principal'
    },
    {
      fecha: '22 Mayo',
      titulo: 'Torneo de Debate',
      hora: '10:00 - 18:00',
      lugar: 'Sala de Conferencias A'
    },
    {
      fecha: '1 Junio',
      titulo: 'Exposici&oacute;n de Arte Estudiantil',
      hora: '11:00 - 20:00',
      lugar: 'Galer&iacute;a de Arte del Campus'
    },
    {
      fecha: '10 Junio',
      titulo: 'Conferencia de Innovaci&oacute;n Tecnol&oacute;gica',
      hora: '09:00 - 13:00',
      lugar: 'Centro de Tecnolog&iacute;a'
    }
  ];

  return (
    <section className="calendario-resumen">
      <h2>Pr&oacute;ximos Eventos</h2>
      <div className="eventos-timeline">
        {proximosEventos.map((evento, index) => (
          <div key={index} className="evento-item">
            <div className="evento-fecha">{evento.fecha}</div>
            <div className="evento-contenido">
              <h3>{evento.titulo}</h3>
              <p><FaClock /> {evento.hora}</p>
              <p><FaMapMarkerAlt /> {evento.lugar}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-ver-todos">Ver todos los eventos</button>
    </section>
  );
};

const UltimosAnuncios = () => {
  const anuncios = [
    {
      titulo: 'Nuevo sistema de registro para eventos',
      descripcion: 'Hemos implementado un nuevo sistema de registro en l&iacute;nea para facilitar tu participaci&oacute;n en los eventos.',
      fecha: '10 de Mayo, 2023',
      icono: <FaBullhorn />
    },
    {
      titulo: 'Cambios en el calendario acad&eacute;mico',
      descripcion: 'Se han realizado ajustes importantes en el calendario acad&eacute;mico. Revisa las nuevas fechas.',
      fecha: '5 de Mayo, 2023',
      icono: <FaCalendarAlt />
    },
    {
      titulo: 'Convocatoria para voluntarios en eventos',
      descripcion: '&Uacute;nete a nuestro equipo de voluntarios y s&eacute; parte de la organizaci&oacute;n de eventos emocionantes!',
      fecha: '1 de Mayo, 2023',
      icono: <FaUsers />
    }
  ];

  return (
    <section className="ultimos-anuncios">
      <h2>&Uacute;ltimos Anuncios</h2>
      <div className="anuncios-container">
        {anuncios.map((anuncio, index) => (
          <div key={index} className="anuncio-item">
            <div className="anuncio-icono">{anuncio.icono}</div>
            <div className="anuncio-contenido">
              <h3>{anuncio.titulo}</h3>
              <p>{anuncio.descripcion}</p>
              <span className="anuncio-fecha">{anuncio.fecha}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-ver-todos-anuncios">
        Ver todos los anuncios <FaArrowRight />
      </button>
    </section>
  );
};

const EstadisticasEventos = () => {
  const estadisticas = [
    { icono: <FaCalendar />, numero: 500, texto: 'Eventos al a&ntilde;o', sufijo: '+' },
    { icono: <FaUsers />, numero: 10000, texto: 'Participantes', sufijo: '+' },
    { icono: <FaUniversity />, numero: 50, texto: 'Organizaciones estudiantiles', sufijo: '+' }
  ];

  return (
    <section className="estadisticas-eventos">
      <h2>Nuestro Impacto en N&uacute;meros</h2>
      <div className="estadisticas-container">
        {estadisticas.map((stat, index) => (
          <div key={index} className="estadistica-item">
            <div className="estadistica-icono">{stat.icono}</div>
            <div className="estadistica-numero">
              <CountUp end={stat.numero} duration={2.5} separator="," suffix={stat.sufijo} />
            </div>
            <p className="estadistica-texto">{stat.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const TestimoniosEstudiantes = () => {
  const [index, setIndex] = React.useState(0);

  const testimonios = [
    {
      nombre: "Mar&iacute;a G&oacute;mez",
      carrera: "Ingenier&iacute;a Inform&aacute;tica",
      testimonio: "Los eventos de la universidad han enriquecido enormemente mi experiencia estudiantil. He podido conectar con profesionales de la industria y expandir mis horizontes.",
      imagen: "https://randomuser.me/api/portraits/women/1.jpg",
      estrellas: 5
    },
    {
      nombre: "Carlos Rodr&iacute;guez",
      carrera: "Medicina",
      testimonio: "Participar en los seminarios de investigaci&oacute;n me ha abierto las puertas a oportunidades que nunca imagin&eacute;. &iexcl;Es incre&iacute;ble c&oacute;mo estos eventos pueden cambiar tu trayectoria!",
      imagen: "https://randomuser.me/api/portraits/men/1.jpg",
      estrellas: 5
    },
    {
      nombre: "Laura Mart&iacute;nez",
      carrera: "Dise&ntilde;o Gr&aacute;fico",
      testimonio: "Las exposiciones de arte y los talleres creativos han sido fundamentales para mi crecimiento como dise&ntilde;adora. He podido mostrar mi trabajo y recibir feedback valioso.",
      imagen: "https://randomuser.me/api/portraits/women/2.jpg",
      estrellas: 4
    }
  ];

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <section className="testimonios-estudiantes">
      <h2>Lo que dicen nuestros estudiantes</h2>
      <Carousel activeIndex={index} onSelect={handleSelect} interval={5000} pause="hover">
        {testimonios.map((testimonio, idx) => (
          <Carousel.Item key={idx}>
            <Card className="testimonio-card">
              <Card.Body>
                <div className="testimonio-imagen">
                  <img src={testimonio.imagen} alt={testimonio.nombre} />
                </div>
                <blockquote className="blockquote">
                  <FaQuoteLeft className="quote-icon left" />
                  <p>{testimonio.testimonio}</p>
                  <FaQuoteRight className="quote-icon right" />
                </blockquote>
                <footer className="blockquote-footer">
                  <strong>{testimonio.nombre}</strong>, {testimonio.carrera}
                </footer>
                <div className="estrellas">
                  {[...Array(testimonio.estrellas)].map((_, i) => (
                    <FaStar key={i} className="estrella" />
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
};

const BoletinInformativo = () => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor, ingresa tu correo electr&oacute;nico.');
      return;
    }
    // Aqu&iacute; ir&iacute;a la l&oacute;gica para enviar el email a tu backend
    console.log('Email subscrito:', email);
    setSubscribed(true);
    setEmail('');
    setError('');
  };

  return (
    <section className="boletin-informativo">
      <div className="boletin-content">
        <FaEnvelope className="boletin-icon" />
        <h2>Mantente Informado</h2>
        <p>Suscr&iacute;bete a nuestro bolet&iacute;n y no te pierdas ning&uacute;n evento importante</p>
        {subscribed ? (
          <Alert variant="success">
            ¡Gracias por suscribirte! Pronto recibir&aacute;s noticias emocionantes.
          </Alert>
        ) : (
          <Form onSubmit={handleSubmit} className="boletin-form">
            <Form.Group controlId="formBasicEmail">
              <div className="input-group">
                <Form.Control
                  type="email"
                  placeholder="Tu correo electr&oacute;nico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!error}
                />
                <Button variant="light" type="submit">
                  <FaPaperPlane /> Suscribirse
                </Button>
              </div>
              <Form.Control.Feedback type="invalid">
                {error}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        )}
        <small className="boletin-disclaimer">
          Respetamos tu privacidad. Puedes darte de baja en cualquier momento.
        </small>
      </div>
    </section>
  );
};

const PaginaPrincipal = () => {
  return (
    <div className="pagina-principal">
      <BarraNavegacion />
      <Hero />
      <CountdownTimer />
      <EventosDestacados />
      <CampusMapSection />
      <CalendarioResumen />
      <UltimosAnuncios />
      <EstadisticasEventos />
      <TestimoniosEstudiantes />
      <BoletinInformativo />
    </div>
  );
};

export default PaginaPrincipal;