import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Carousel,
} from "react-bootstrap";
import "../styles/MisSuscripciones.css";
import { BarraNavegacion } from '../Components/BarraNavegacion';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot, collection, getDocs, updateDoc, increment } from "firebase/firestore";
import EventosDisponibles from '../Components/EventosDisponibles'; 
import PieDePagina from "./pieDePagina";
import EventosDestacadosSection from './EventosDestacadosSection';



const MisSuscripciones = () => {
  const [eventosDisponibles, setEventosDisponibles] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [user, setUser] = useState(null);
  const [contadorEventos, setContadorEventos] = useState({});

  const sincronizarContadores = useCallback(async () => {
    if (!user) return;

    const contadorRef = doc(db, "contadores", "eventos");
    const eventosRef = collection(db, "eventos");

    try {
      const eventosSnapshot = await getDocs(eventosRef);
      let newContadores = {};

      // Inicializar contadores para todos los eventos
      eventosSnapshot.forEach((doc) => {
        newContadores[doc.id] = 0;
      });

      // Contar suscripciones
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((userDoc) => {
        const userSuscripciones = userDoc.data().suscripciones || [];
        userSuscripciones.forEach(evento => {
          if (newContadores.hasOwnProperty(evento.id)) {
            newContadores[evento.id]++;
          }
        });
      });

      await setDoc(contadorRef, newContadores);
      setContadorEventos(newContadores);  // Actualiza el estado local
      console.log("Contadores sincronizados:", newContadores);
    } catch (error) {
      console.error("Error al sincronizar contadores:", error);
    }
  }, [user]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const eventosCollection = collection(db, 'eventos');
        const eventosSnapshot = await getDocs(eventosCollection);
        const eventosData = eventosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEventosDisponibles(eventosData);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    fetchEventos();

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribeUser = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const userSuscripciones = doc.data().suscripciones || [];
            setSuscripciones(userSuscripciones);
            console.log("Suscripciones actualizadas:", userSuscripciones);
            sincronizarContadores();
          } else {
            setSuscripciones([]);
          }
        });
        return () => unsubscribeUser();
      } else {
        setSuscripciones([]);
      }
    });

    const contadorRef = doc(db, "contadores", "eventos");
    const unsubscribeContador = onSnapshot(contadorRef, (doc) => {
      if (doc.exists()) {
        const nuevosContadores = doc.data();
        
        Object.keys(nuevosContadores).forEach(key => {
          if (nuevosContadores[key] < 0) {
            nuevosContadores[key] = 0;
          }
        });
        setContadorEventos(nuevosContadores);
        console.log("Contadores actualizados desde Firestore:", nuevosContadores);
      } else {
        setContadorEventos({});
      }
    });

    return () => {
      unsubscribe();
      unsubscribeContador();
    };
  }, []); 

  const toggleSuscripcion = useCallback(async (evento) => {
    if (!user) {
      alert("Por favor, inicia sesión para suscribirte a eventos.");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const eventoRef = doc(db, "eventos", evento.id);
    const contadorRef = doc(db, "contadores", "eventos");

    try {
      let newSuscripciones;
      let cuposIncrement;

      if (suscripciones.some(e => e.id === evento.id)) {
        // Cancelar suscripción
        newSuscripciones = suscripciones.filter(e => e.id !== evento.id);
        cuposIncrement = 1;
      } else {
        // Suscribirse
        if (evento.cuposDisponibles <= 0) {
          alert("Lo sentimos, no hay cupos disponibles para este evento.");
          return;
        }
        newSuscripciones = [...suscripciones, evento];
        cuposIncrement = -1;
      }

      await updateDoc(userRef, { suscripciones: newSuscripciones });
      await updateDoc(eventoRef, { cuposDisponibles: increment(cuposIncrement) });
      await updateDoc(contadorRef, { [evento.id]: increment(cuposIncrement * -1) });

      // Actualizar estados locales
      setSuscripciones(newSuscripciones);
      setContadorEventos(prev => ({
        ...prev,
        [evento.id]: (prev[evento.id] || 0) + (cuposIncrement * -1)
      }));

      // Actualizar cupos disponibles en el estado de eventos
      setEventosDisponibles(prevEventos => 
        prevEventos.map(e => 
          e.id === evento.id 
            ? {...e, cuposDisponibles: e.cuposDisponibles + cuposIncrement} 
            : e
        )
      );

    } catch (err) {
      console.error("Error al actualizar suscripciones:", err);
      alert("Error al actualizar suscripciones. Por favor, inténtalo de nuevo.");
    }
  }, [user, suscripciones, setContadorEventos, setEventosDisponibles]);

  const eventosFiltrados = useMemo(() => {
    return eventosDisponibles.filter(
      (evento) =>
        (categoriaSeleccionada ? evento.categoria === categoriaSeleccionada : true) &&
        (evento.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
          evento.categoria.toLowerCase().includes(filtro.toLowerCase()) ||
          evento.facultad.toLowerCase().includes(filtro.toLowerCase()))
    );
  }, [eventosDisponibles, categoriaSeleccionada, filtro]);

  const isSuscrito = useCallback((eventoId) => {
    return suscripciones.some(e => e.id === eventoId);
  }, [suscripciones]);

  return (
    <div>
      <BarraNavegacion />

      <BienvenidaSection />

      <EventosDestacadosSection 
        eventosDisponibles={eventosDisponibles}
        titulo="Eventos Destacados"
        descripcion="Descubre los eventos más emocionantes y populares de nuestra universidad"
      />

      <EventosDisponibles 
        eventosFiltrados={eventosFiltrados}
        categoriaSeleccionada={categoriaSeleccionada}
        setCategoriaSeleccionada={setCategoriaSeleccionada}
        filtro={filtro}
        setFiltro={setFiltro}
        isSuscrito={isSuscrito}
        toggleSuscripcion={toggleSuscripcion}
        contadorEventos={contadorEventos} 
        eventosDisponibles={eventosDisponibles}
        setEventosDisponibles={setEventosDisponibles}
      />

      <VideoPromoSection />

      <PieDePagina />
    </div>
  );
};

const BienvenidaSection = () => (
  <section className="bienvenida">
    <Container>
      <Row className="align-items-center">
        <Col md={6} className="text-center text-md-start mb-4 mb-md-0">
          <h1 className="display-4 fw-bold">¡Gracias por unirte a EventPlace!</h1>
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
);

const VideoPromoSection = () => (
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
);

export default MisSuscripciones;