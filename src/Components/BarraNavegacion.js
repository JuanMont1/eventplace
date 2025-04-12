import { useEffect, useState } from "react";
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import logo from "../archivos/img/logo.png";
import { FaSearch, FaUserCircle, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../styles/BarraNavegacion.css";

export const BarraNavegacion = () => {
  const [desplazado, setDesplazado] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [menuExpandido, setMenuExpandido] = useState(false);
  const navegar = useNavigate();

  useEffect(() => {
    const manejarScroll = () => {
      setDesplazado(window.scrollY > 50);
    };

    window.addEventListener("scroll", manejarScroll);
    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);

  const manejarCambioBusqueda = (e) => {
    setBusqueda(e.target.value);
    console.log("Buscando:", e.target.value);
  };

  const irALogin = () => {
    navegar("/login");
  };

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
                Eventos
              </Nav.Link>
              <Nav.Link as={Link} to="/calendario">
                Calendario
              </Nav.Link>
              <Nav.Link as={Link} to="/mis-suscripciones">
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
              <NavDropdown title="Categorías" id="menu-categorias">
                <NavDropdown.Item as={Link} to="/categoria/academicos">
                  Académicos
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/categoria/culturales">
                  Culturales
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/categoria/deportivos">
                  Deportivos
                </NavDropdown.Item>
              </NavDropdown>
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
                {usuarioActivo ? (
                  <Link to="/perfil" className="enlace-perfil">
                    <FaUserCircle className="icono-usuario" />
                    <span className="nombre-usuario">{usuarioActivo.name}</span>
                  </Link>
                ) : (
                  <Button
                    onClick={irALogin}
                    className="btn-iniciar-sesion btn-transparente"
                  >
                    Iniciar sesión
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
