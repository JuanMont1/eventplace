import React from 'react';
import { useEffect, useState, useCallback } from "react";
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import logo from "../archivos/img/logo.png";
import { FaSearch, FaUserCircle, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../styles/BarraNavegacion.css";
import { useAuth } from '../contexts/AuthContext';
/* hola */
export const BarraNavegacion2 = () => {
  const [desplazado, setDesplazado] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const { user, logout } = useAuth();
  const [menuExpandido, setMenuExpandido] = useState(false);
  const navegar = useNavigate();
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  useEffect(() => {
    const manejarScroll = () => {
      setDesplazado(window.scrollY > 50);
    };

    window.addEventListener("scroll", manejarScroll);

    return () => {
      window.removeEventListener("scroll", manejarScroll);
    };
  }, []);

  const manejarCambioBusqueda = (e) => {
    setBusqueda(e.target.value);
    console.log("Buscando:", e.target.value);
  };

  const cerrarSesion = useCallback(async () => {
    if (cerrandoSesion) return; // Evita múltiples intentos de cierre de sesión

    setCerrandoSesion(true);
    try {
      await logout();
      console.log("Sesión cerrada exitosamente");
      navegar('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
     
    } finally {
      setCerrandoSesion(false);
    }
  }, [logout, navegar, cerrandoSesion]);

  return (
    <>
      <div className={`fondo-barra ${desplazado ? "con-scroll" : ""}`}></div>
      <Navbar
        expand="lg"
        className={`barra-personalizada ${desplazado ? "con-scroll" : ""}`}
        expanded={menuExpandido}
      >
        <Container fluid className="px-4">
          <Navbar.Brand as={Link} to="/" className="me-0">
            <img
              src={logo}
              alt="Universidad de Cundinamarca"
              className={`logo-barra ${desplazado ? "con-scroll" : ""}`}
            />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="menu-navegacion"
            onClick={() => setMenuExpandido(!menuExpandido)}
          >
            <FaBars />
          </Navbar.Toggle>
          <Navbar.Collapse id="menu-navegacion" className="justify-content-end">
            <Nav className="alineacion-items">
              <Nav.Link as={Link} to="/eventos">
              GaleriaEventos
              </Nav.Link>
              <Nav.Link as={Link} to="/calendario">
                Calendario
              </Nav.Link>
              <Nav.Link as={Link} to="/MisSuscripciones">
                Mis Suscripciones
              </Nav.Link>
              <NavDropdown title="Facultades" id="menu-facultades">
                <NavDropdown.Item as={Link} to="/facultad/ingenieria">
                  Ingeniería
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/facultad/ciencias">
                  Ciencias
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/proximos-eventos">Próximos Eventos</Nav.Link>
              <div className="busqueda-seccion d-none d-lg-flex ms-3">
                <FaSearch className="icono-busqueda" />
                <input
                  type="text"
                  className="input-busqueda"
                  value={busqueda}
                  onChange={manejarCambioBusqueda}
                  placeholder="Buscar eventos..."
                />
              </div>
              <div className="seccion-usuario ms-3">
                {user ? (
                  <NavDropdown
                    title={
                      <span className="d-inline-block">
                        <FaUserCircle className="icono-usuario" />
                        <span className="nombre-usuario">{user.displayName || 'Usuario'}</span>
                      </span>
                    }
                    id="menu-usuario"
                  >
                    <NavDropdown.Item as={Link} to="/perfil">Mi Perfil</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/MisSuscripciones">Mis Suscripciones</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={cerrarSesion} disabled={cerrandoSesion}>
                      {cerrandoSesion ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Button
                    onClick={() => navegar('/login')}
                    className="btn-login btn-transparente"
                  >
                    Iniciar Sesión
                  </Button>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};
