import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Carousel, Alert, Modal } from 'react-bootstrap';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaBullhorn, FaArrowRight, FaCalendar, FaUniversity, FaQuoteLeft, FaQuoteRight, FaStar, FaPaperPlane, FaEnvelope, FaComments, FaUser, FaLightbulb, FaHistory, FaTools } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/PaginaPrincipal.css';
import CountUp from 'react-countup';
import welcomeGif from '../archivos/img/abeja.gif';
import L from 'leaflet';
import { db } from '../config/firebase';
import { BarraNavegacion } from '../Components/common/BarraNavegacion';
import PieDePagina from '../Components/common/pieDePagina';
import emailjs from 'emailjs-com';
import soachaIconImg from '../archivos/img/Punto de marca.png';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

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
              Tu puerta de entrada a experiencias universitarias inolvidables, Descubre, participa y crea momentos que definirán tu vida universitaria
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
      <h2>Proximo Super Evento:</h2>
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
  const eventLocation = [4.5787567, -74.2234352];

  const soachaIcon = new L.Icon({
    iconUrl: soachaIconImg,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });

  return (
    <div className="campus-map-container">
      <div className="campus-map-content">
        <h2>📍 Ubicación de los eventos</h2>
        <h3>Explora en el mapa los espacios donde se llevarán a cabo las actividades universitarias más importantes</h3>
      </div>
      <div className="campus-map">
        <MapContainer center={eventLocation} zoom={20} scrollWheelZoom={false} style={{ height: '600px', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={eventLocation} icon={soachaIcon}>
            <Popup>
              Universidad de Cundinamarca, sede Soacha<br />
              Diagonal 9 No. 4B-85, Soacha, Cundinamarca
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
          <p className="eventos-hero-subtitle">Descubre las actividades con más inscripciones, seleccionadas por su impacto, popularidad y valor para tu crecimiento académico y personal. ¡No te las pierdas!</p>
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






const FormularioOpiniones = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [tipo, setTipo] = useState('opinion');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault();
    setError('');

    emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        {
          to_email: 'juancarvafb@gmail.com',
          from_name: nombre,
          from_email: email,
          message_type: tipo,
          message: mensaje
        },
        'YOUR_USER_ID'
      )
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setEnviado(true);
      }, (err) => {
        console.log('FAILED...', err);
        setError('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
      });
  };

  return (
    <section className="formulario-opiniones-seccion">
      <div className="formulario-contenedor">
        <div className="formulario-info">
          <h2><FaLightbulb /> Tu opinión es importante</h2>
          <p>Nos esforzamos por mejorar constantemente. Tu feedback nos ayuda a crear mejores experiencias para toda la comunidad universitaria.</p>
          <ul>
            <li><FaLightbulb /> Comparte tus ideas para nuevos eventos</li>
            <li><FaHistory /> Cuéntanos sobre tu experiencia en eventos pasados</li>
            <li><FaTools /> Sugiere mejoras para nuestros servicios</li>
          </ul>
        </div>
        <div className="formulario-wrapper">
          <h2><FaComments /> Envía tu Opinión, Queja o Reclamo</h2>
          {enviado ? (
            <div className="mensaje-exito">
              <h3><FaPaperPlane /> ¡Gracias por tu mensaje!</h3>
              <p>Tu opinión, queja o reclamo ha sido enviado correctamente. Te responderemos pronto.</p>
            </div>
          ) : (
            <form onSubmit={manejarEnvio}>
              <div className="campo-formulario">
                <label htmlFor="nombre"><FaUser /> Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="campo-formulario">
                <label htmlFor="email"><FaEnvelope /> Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="campo-formulario">
                <label htmlFor="tipo"><FaComments /> Tipo de Mensaje</label>
                <select
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="opinion">Opinión</option>
                  <option value="queja">Queja</option>
                  <option value="reclamo">Reclamo</option>
                </select>
              </div>

              <div className="campo-formulario">
                <label htmlFor="mensaje"><FaComments /> Tu Mensaje</label>
                <textarea
                  id="mensaje"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  required
                />
              </div>

              {error && <div className="error-mensaje">{error}</div>}

              <button type="submit" className="btn-enviar">
                <FaPaperPlane /> Enviar Mensaje
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};




const UltimosAnuncios = () => {
  const [anuncios, setAnuncios] = useState([]);
  const navigate = useNavigate();

  const handleVerTodosAnuncios = () => {
    navigate('/todos-los-anuncios');
  };

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const anunciosRef = collection(db, 'anuncios');
        const q = query(anunciosRef, orderBy('fecha', 'desc'), limit(3));
        const querySnapshot = await getDocs(q);
        const anunciosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAnuncios(anunciosData);
      } catch (error) {
        console.error("Error al obtener anuncios:", error);
      }
    };

    fetchAnuncios();
  }, []);

  const getIcono = (tipo) => {
    switch (tipo) {
      case 'evento': return <FaBullhorn />;
      case 'calendario': return <FaCalendarAlt />;
      case 'voluntarios': return <FaUsers />;
      default: return <FaBullhorn />;
    }
  };

  const formatearFecha = (fecha) => {
    if (fecha instanceof Date) {
      return fecha.toLocaleDateString();
    } else if (typeof fecha === 'object' && fecha.seconds) {
      // Firestore Timestamp
      return new Date(fecha.seconds * 1000).toLocaleDateString();
    } else if (typeof fecha === 'string') {
      // Intenta parsear la fecha si es una cadena
      const parsedDate = new Date(fecha);
      return isNaN(parsedDate.getTime()) ? fecha : parsedDate.toLocaleDateString();
    } else if (typeof fecha === 'number') {
      return new Date(fecha).toLocaleDateString();
    }
    return 'Fecha no disponible';
  };

  return (
    <section className="ultimos-anuncios">
      <h2>Últimos Anuncios</h2>
      <div className="anuncios-container">
        {anuncios.map((anuncio) => (
          <div key={anuncio.id} className="anuncio-item">
            <div className="anuncio-icono">{getIcono(anuncio.tipo)}</div>
            <div className="anuncio-contenido">
              <h3>{anuncio.titulo}</h3>
              <p>{anuncio.descripcion}</p>
              <span className="anuncio-fecha">{formatearFecha(anuncio.fecha)}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-ver-todos-anuncios" onClick={handleVerTodosAnuncios}>
        Ver todos los anuncios <FaArrowRight />
      </button>
    </section>
  );
};





const EstadisticasEventos = () => {
  const estadisticas = [
      { icono: <FaCalendar />, numero: 20, texto: 'Eventos al año', sufijo: '+' },
      { icono: <FaUsers />, numero: 200, texto: 'Estudiantes que Participan', sufijo: '+' },
      { icono: <FaUniversity />, numero: 5, texto: 'Apoyos universitarios', sufijo: '+' }
    ];
  
    return (
      <section className="estadisticas-eventos">
        <h2 className="estadisticas-titulo">Nuestro Impacto en Números</h2>
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
        nombre: "María Gómez",
        carrera: "Ingeniería Informática",
        testimonio: "Los eventos académicos y tecnológicos organizados por la Universidad de Cundinamarca han sido clave en mi formación. Las conferencias y hackathons me han permitido aprender y poner en práctica mis conocimientos.",
        imagen: "https://randomuser.me/api/portraits/women/1.jpg",
        estrellas: 5
    },
    {
        nombre: "Carlos Rodríguez",
        carrera: "Medicina",
        testimonio: "Gracias a los congresos de investigación en la UdeC, he podido conectarme con investigadores nacionales e internacionales. Estas experiencias han transformado mis metas profesionales.",
        imagen: "https://randomuser.me/api/portraits/men/1.jpg",
        estrellas: 5
    },
    {
        nombre: "Laura Martínez",
        carrera: "Diseño Gráfico",
        testimonio: "Los talleres artísticos y las exposiciones organizadas por la UdeC han sido esenciales para mi desarrollo creativo. Estos eventos me han dado la oportunidad de mostrar mi trabajo y crecer como profesional.",
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
        setError('Por favor, ingresa tu correo electrónico.');
        return;
      }
      console.log('Email subscrito:', email);
      setSubscribed(true);
      setEmail('');
      setError('');
    };
  
    return (
      <section className="boletin-informativo">
        <div className="boletin-content">
          <div className="boletin-header">
            <FaEnvelope className="boletin-icon" />
            <h2>Mantente Informado</h2>
          </div>
          <p>Suscríbete a nuestro boletín y no te pierdas ningún evento importante</p>
          {subscribed ? (
            <Alert variant="success" className="boletin-alert">
              ¡Gracias por suscribirte! Pronto recibirás noticias emocionantes.
            </Alert>
          ) : (
            <Form onSubmit={handleSubmit} className="boletin-form">
              <Form.Group controlId="formBasicEmail">
                <div className="input-group">
                  <Form.Control
                    type="email"
                    placeholder="Tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!error}
                  />
                  <Button variant="primary" type="submit">
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
    <>
      <div className="pagina-principal">
        <BarraNavegacion />
        <Hero />
        <CountdownTimer />
        <EventosDestacados />
        <CampusMapSection />
        <UltimosAnuncios />
        <EstadisticasEventos />
        <TestimoniosEstudiantes />
        <FormularioOpiniones />
        <BoletinInformativo />
      </div>
      <PieDePagina />
    </>
  );
};

export default PaginaPrincipal;


