import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Tabs, Tab, Form } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, query, where, updateDoc, writeBatch, addDoc, getDoc, setDoc } from 'firebase/firestore';
import EventosDisponibles from './EventosDisponibles';
import { useAuth } from '../contexts/AuthContext'; // Asegúrate de tener este contexto

const GestionEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [eventoAEliminar, setEventoAEliminar] = useState(null);
  const [eventoAEditar, setEventoAEditar] = useState(null);
  const [eventosDisponibles, setEventosDisponibles] = useState([]);

  const fetchEventos = async () => {
    try {
      const eventosCollection = collection(db, 'eventos');
      const eventosSnapshot = await getDocs(eventosCollection);
      const eventosData = eventosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
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
    setEventoAEditar({...evento});
    setShowEditModal(true);
  };

  const confirmarEliminar = async () => {
    if (eventoAEliminar) {
      try {
        await deleteDoc(doc(db, 'eventos', eventoAEliminar.id));
        await eliminarSuscripcionesDeUsuarios(eventoAEliminar.id);
        await fetchEventos();
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error al eliminar el evento:", error);
        alert("Hubo un error al eliminar el evento. Por favor, inténtalo de nuevo.");
      }
    }
  };

  const handleEditarChange = (e) => {
    const { name, value } = e.target;
    setEventoAEditar(prevEvento => ({
      ...prevEvento,
      [name]: value
    }));
  };

  const confirmarEditar = async () => {
    if (eventoAEditar) {
      try {
        const eventoRef = doc(db, 'eventos', eventoAEditar.id);
        await updateDoc(eventoRef, {
          nombre: eventoAEditar.nombre,
          categoria: eventoAEditar.categoria,
          fecha: eventoAEditar.fecha,
          // Añade aquí otros campos que quieras actualizar
        });
        await fetchEventos(); // Actualiza la lista de eventos
        setShowEditModal(false);
        alert("Evento actualizado con éxito");
      } catch (error) {
        console.error("Error al editar el evento:", error);
        alert("Hubo un error al editar el evento. Por favor, inténtalo de nuevo.");
      }
    }
  };

  const eliminarSuscripcionesDeUsuarios = async (eventoId) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('suscripciones', 'array-contains', { id: eventoId }));
    const querySnapshot = await getDocs(q);

    const batch = writeBatch(db);
    querySnapshot.forEach((userDoc) => {
      const userRef = doc(db, 'users', userDoc.id);
      const suscripciones = userDoc.data().suscripciones.filter(s => s.id !== eventoId);
      batch.update(userRef, { suscripciones: suscripciones });
    });

    await batch.commit();
  };

  const { currentUser } = useAuth(); // Obtén el usuario actual del contexto de autenticación
  const [userSuscripciones, setUserSuscripciones] = useState([]);

  useEffect(() => {
    const fetchUserSuscripciones = async () => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserSuscripciones(userSnap.data().suscripciones || []);
        }
      }
    };

    fetchUserSuscripciones();
  }, [currentUser]);

  const isSuscrito = (eventoId) => {
    return userSuscripciones.some(suscripcion => suscripcion.id === eventoId);
  };

  const toggleSuscripcion = async (evento) => {
    if (!currentUser) {
      alert("Por favor, inicia sesión para suscribirte a eventos.");
      return;
    }

    const userRef = doc(db, 'users', currentUser.uid);
    try {
      const userSnap = await getDoc(userRef);
      let currentSuscripciones = userSnap.exists() ? (userSnap.data().suscripciones || []) : [];

      if (currentSuscripciones.some(e => e.id === evento.id)) {
        currentSuscripciones = currentSuscripciones.filter(e => e.id !== evento.id);
      } else {
        currentSuscripciones.push(evento);
      }

      await setDoc(userRef, { suscripciones: currentSuscripciones }, { merge: true });
      setUserSuscripciones(currentSuscripciones);
      console.log(`Toggle suscripción para evento ${evento.id}`);
    } catch (error) {
      console.error("Error al actualizar suscripciones:", error);
      alert("Hubo un error al actualizar la suscripción. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <Container style={{ paddingTop: '300px' }}>
      <h2 className="my-4">Gestión de Eventos</h2>
      <Tabs defaultActiveKey="lista" id="gestion-eventos-tabs" className="mb-3">
        <Tab eventKey="lista" title="Lista de Eventos">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
            {eventos.map(evento => (
              <tr key={evento.id}>
                <td>{evento.nombre}</td>
                <td>{evento.categoria}</td>
                <td>{evento.fecha}</td>
                <td>
                  <Button variant="primary" onClick={() => handleEditar(evento)} className="me-2">Editar</Button>
                  <Button variant="danger" onClick={() => handleEliminar(evento)}>Eliminar</Button>
                </td>
              </tr>
            ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="disponibles" title="Eventos Disponibles">
          <EventosDisponibles 
            eventosFiltrados={eventosDisponibles}
            isSuscrito={isSuscrito}
            toggleSuscripcion={toggleSuscripcion}
          />
        </Tab>
      </Tabs>

      {/* Modal de Eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar permanentemente el evento "{eventoAEliminar?.nombre}"?
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
                value={eventoAEditar?.nombre || ''} 
                onChange={handleEditarChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Control 
                type="text" 
                name="categoria" 
                value={eventoAEditar?.categoria || ''} 
                onChange={handleEditarChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control 
                type="date" 
                name="fecha" 
                value={eventoAEditar?.fecha || ''} 
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

export default GestionEventos;