import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const AgregarEvento = () => {
  const [evento, setEvento] = useState({
    nombre: "",
    categoria: "",
    fecha: "",
    facultad: "",
    imagen: "",
    descripcion: "",
  });
  const navigate = useNavigate();

  const { nombre, categoria, fecha, facultad, imagen, descripcion } = evento;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvento((prevEvento) => ({
      ...prevEvento,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "eventos"), evento);
      console.log("Evento agregado con ID: ", docRef.id);
      alert("Evento agregado con éxito");
      navigate("/admin/eventos");
    } catch (e) {
      console.error("Error al agregar el evento: ", e);
      alert("Error al agregar el evento. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div style={{ paddingTop: "300px" }}>
      <Container>
        <h2 className="my-4">Agregar Nuevo Evento</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del Evento</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  name="categoria"
                  value={categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  <option value="Académico">Académico</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Deportivo">Deportivo</option>
                  <option value="Artístico">Artístico</option>
                  <option value="Tecnológico">Tecnológico</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha"
                  value={fecha}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Facultad</Form.Label>
                <Form.Control
                  type="text"
                  name="facultad"
                  value={facultad}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>URL de la Imagen del Evento</Form.Label>
            <Form.Control
              type="url"
              name="imagen"
              value={imagen}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={descripcion}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Agregar Evento
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default AgregarEvento;
