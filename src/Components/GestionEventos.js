import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Tabs, Tab } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';
import EventosDisponibles from './EventosDisponibles';
import { getMockEventos, deleteMockEvento } from '../mockData';

const GestionEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventoAEliminar, setEventoAEliminar] = useState(null);

  const fetchEventos = async () => {
    // Obtener eventos de Firebase
    const eventosCollection = collection(db, 'eventos');
    const eventosSnapshot = await getDocs(eventosCollection);
    const eventosFirebase = eventosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      tipo: 'firebase'
    }));

    // Obtener eventos mock
    const eventosMock = getMockEventos().map(evento => ({
      ...evento,
      tipo: 'mock'
    }));

    // Combinar eventos de Firebase y mock
    const todosLosEventos = [...eventosFirebase, ...eventosMock];
    setEventos(todosLosEventos);
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleEliminar = (evento) => {
    setEventoAEliminar(evento);
    setShowModal(true);
  };

  const eliminarSuscripcionesDeUsuarios = async (eventoId) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('suscripciones', 'array-contains', { id: eventoId }));
    const querySnapshot = await getDocs(q);

    const batch = db.batch();
    querySnapshot.forEach((userDoc) => {
      const userRef = doc(db, 'users', userDoc.id);
      const suscripciones = userDoc.data().suscripciones.filter(s => s.id !== eventoId);
      batch.update(userRef, { suscripciones: suscripciones });
    });

    await batch.commit();
  };

  const confirmarEliminar = async () => {
    if (eventoAEliminar) {
      try {
        if (eventoAEliminar.tipo === 'firebase') {
          await deleteDoc(doc(db, 'eventos', eventoAEliminar.id));
          await eliminarSuscripcionesDeUsuarios(eventoAEliminar.id);
        } else if (eventoAEliminar.tipo === 'mock') {
          deleteMockEvento(eventoAEliminar.id);
          // Para eventos mock, también deberíamos actualizar las suscripciones de los usuarios
          // Esto dependerá de cómo estés manejando las suscripciones para eventos mock
        }
        // Actualizar la lista de eventos después de eliminar
        await fetchEventos();
        setShowModal(false);
      } catch (error) {
        console.error("Error al eliminar el evento:", error);
        alert("Hubo un error al eliminar el evento. Por favor, inténtalo de nuevo.");
      }
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
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map(evento => (
                <tr key={evento.id}>
                  <td>{evento.nombre}</td>
                  <td>{evento.categoria}</td>
                  <td>{evento.fecha}</td>
                  <td>{evento.tipo === 'firebase' ? 'Real' : 'Mock'}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleEliminar(evento)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="disponibles" title="Eventos Disponibles">
          <EventosDisponibles 
            eventosFiltrados={eventos}
            isSuscrito={() => false} 
            toggleSuscripcion={() => {}} 
          />
        </Tab>
      </Tabs>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar permanentemente el evento "{eventoAEliminar?.nombre}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminar}>
            Eliminar Permanentemente
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GestionEventos;