import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Tabs,
  Tab,
  Form,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
  writeBatch,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCalendarAlt, faTag } from "@fortawesome/free-solid-svg-icons";

const GestionEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [eventoAEliminar, setEventoAEliminar] = useState(null);
  const [eventoAEditar, setEventoAEditar] = useState(null);
  const [eventosDisponibles, setEventosDisponibles] = useState([]);
  const [contadorEventos, setContadorEventos] = useState({});

  const fetchEventos = async () => {
    try {
      const eventosCollection = collection(db, "eventos");
      const eventosSnapshot = await getDocs(eventosCollection);
      const eventosData = eventosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEventos(eventosData);
      setEventosDisponibles(eventosData);
      console.log("Eventos actualizados:", eventosData);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleEliminar = (evento) => {
    setEventoAEliminar(evento);
    setShowDeleteModal(true);
  };

  const handleEditar = (evento) => {
    setEventoAEditar({ ...evento });
    setShowEditModal(true);
  };

  const confirmarEliminar = async () => {
    if (eventoAEliminar) {
      try {
        await deleteDoc(doc(db, "eventos", eventoAEliminar.id));
        await eliminarSuscripcionesDeUsuarios(eventoAEliminar.id);
        await fetchEventos();
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error al eliminar el evento:", error);
        alert(
          "Hubo un error al eliminar el evento. Por favor, inténtalo de nuevo."
        );
      }
    }
  };

  const handleEditarChange = (e) => {
    const { name, value } = e.target;
    setEventoAEditar((prevEvento) => ({
      ...prevEvento,
      [name]: value,
    }));
  };

  const confirmarEditar = async () => {
    if (eventoAEditar) {
      try {
        const eventoRef = doc(db, "eventos", eventoAEditar.id);
        await updateDoc(eventoRef, {
          nombre: eventoAEditar.nombre,
          categoria: eventoAEditar.categoria,
          fecha: eventoAEditar.fecha,
        });
        await fetchEventos();
        setShowEditModal(false);
        alert("Evento actualizado con éxito");
      } catch (error) {
        console.error("Error al editar el evento:", error);
        alert(
          "Hubo un error al editar el evento. Por favor, inténtalo de nuevo."
        );
      }
    }
  };

  const eliminarSuscripcionesDeUsuarios = async (eventoId) => {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("suscripciones", "array-contains", { id: eventoId })
    );
    const querySnapshot = await getDocs(q);

    const batch = writeBatch(db);
    querySnapshot.forEach((userDoc) => {
      const userRef = doc(db, "users", userDoc.id);
      const suscripciones = userDoc
        .data()
        .suscripciones.filter((s) => s.id !== eventoId);
      batch.update(userRef, { suscripciones: suscripciones });
    });

    await batch.commit();
  };

  const { currentUser } = useAuth();
  const [userSuscripciones, setUserSuscripciones] = useState([]);

  useEffect(() => {
    const fetchUserSuscripciones = async () => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserSuscripciones(userSnap.data().suscripciones || []);
        }
      }
    };

    fetchUserSuscripciones();
  }, [currentUser]);

  const isSuscrito = (eventoId) => {
    return userSuscripciones.some((suscripcion) => suscripcion.id === eventoId);
  };

  const toggleSuscripcion = async (evento) => {
    if (!currentUser) {
      alert("Por favor, inicia sesión para suscribirte a eventos.");
      return;
    }

    const userRef = doc(db, "users", currentUser.uid);
    try {
      const userSnap = await getDoc(userRef);
      let currentSuscripciones = userSnap.exists()
        ? userSnap.data().suscripciones || []
        : [];

      if (currentSuscripciones.some((e) => e.id === evento.id)) {
        currentSuscripciones = currentSuscripciones.filter(
          (e) => e.id !== evento.id
        );
      } else {
        currentSuscripciones.push(evento);
      }

      await setDoc(
        userRef,
        { suscripciones: currentSuscripciones },
        { merge: true }
      );
      setUserSuscripciones(currentSuscripciones);
      console.log(`Toggle suscripción para evento ${evento.id}`);
    } catch (error) {
      console.error("Error al actualizar suscripciones:", error);
      alert(
        "Hubo un error al actualizar la suscripción. Por favor, inténtalo de nuevo."
      );
    }
  };

  useEffect(() => {
    const countSubscriptions = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const subscriptionCounts = {};
      usersSnapshot.forEach((userDoc) => {
        const suscripciones = userDoc.data().suscripciones || [];
        suscripciones.forEach((sub) => {
          subscriptionCounts[sub.id] = (subscriptionCounts[sub.id] || 0) + 1;
        });
      });
      setContadorEventos(subscriptionCounts);
    };

    countSubscriptions();
  }, []);

  return (
    <Container style={{ paddingTop: "300px" }}>
      <h2 className="my-4">Gestión de Eventos</h2>
      <Tabs defaultActiveKey="lista" id="gestion-eventos-tabs" className="mb-3">
        <Tab eventKey="lista" title="Lista de Eventos">
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {eventos.map((evento) => (
              <Col key={evento.id}>
                <div className="evento-card admin-card">
                  <div className="contador-suscripciones">
                    <FontAwesomeIcon icon={faUsers} />
                    <strong>{contadorEventos[evento.id] || 0}</strong>
                  </div>
                  <img
                    src={evento.imagen}
                    className="card-img-top"
                    alt={evento.nombre}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{evento.nombre}</h5>
                    <p className="evento-fecha">
                      <FontAwesomeIcon icon={faCalendarAlt} /> {evento.fecha}
                    </p>
                    <span className="evento-categoria">
                      <FontAwesomeIcon icon={faTag} /> {evento.categoria}
                    </span>
                      <p className="card-text">{evento.descripcion}</p>
                    </div>
                  </div>
                  <div className="button-container mt-2">
                    <Button
                      variant="primary"
                      onClick={() => handleEditar(evento)}
                      className="me-2"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleEliminar(evento)}
                    >
                      Eliminar
                    </Button>
                </div>
              </Col>
            ))}
          </Row>
        </Tab>
        
      </Tabs>

      {/* Modal de Eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar permanentemente el evento "
          {eventoAEliminar?.nombre}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminar}>
            Eliminar Permanentemente
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={eventoAEditar?.nombre || ""}
                onChange={handleEditarChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                name="categoria"
                value={eventoAEditar?.categoria || ""}
                onChange={handleEditarChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="fecha"
                value={eventoAEditar?.fecha || ""}
                onChange={handleEditarChange}
              />
            </Form.Group>
            {/* Agrega más campos según sea necesario */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirmarEditar}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

const EventosDisponibles = ({
  eventosFiltrados,
  isSuscrito,
  toggleSuscripcion,
  contadorEventos,
}) => {
  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {eventosFiltrados.map((evento) => (
        <Col key={evento.id}>
          <Card className="h-100">
            <Card.Img variant="top" src={evento.imagen} />
            <Card.Body>
              <Card.Title>{evento.nombre}</Card.Title>
              <Card.Text>
                <strong>Categoría:</strong> {evento.categoria}
                <br />
                <strong>Fecha:</strong> {evento.fecha}
                <br />
                <strong>Facultad:</strong> {evento.facultad}
                <br />
                <strong>Suscripciones:</strong>{" "}
                {contadorEventos[evento.id] || 0}
              </Card.Text>
              <Button
                variant={isSuscrito(evento.id) ? "danger" : "primary"}
                onClick={() => toggleSuscripcion(evento)}
              >
                {isSuscrito(evento.id) ? "Cancelar suscripción" : "Suscribirse"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default GestionEventos;
