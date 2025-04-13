import { useEffect, useState } from "react";
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import logo from "../archivos/img/logo.png";
import { FaSearch, FaUserCircle, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../styles/BarraNavegacion.css";
import { auth } from '../firebase'; // Asegúrate de importar auth desde tu configuración de Firebase

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

    // Escuchar cambios en el estado de autenticación
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUsuarioActivo({
          name: user.displayName,
          email: user.email,
          // Agrega cualquier otra información del usuario que necesites
        });
      } else {
        setUsuarioActivo(null);
      }
    });

    return () => {
      window.removeEventListener("scroll", manejarScroll);
      unsubscribe();
    };
  }, []);

  const manejarCambioBusqueda = (e) => {
    setBusqueda(e.target.value);
    console.log("Buscando:", e.target.value);
  };

  const irALogin = () => {
    navegar("/login");
  };

  const irAPerfil = () => {
    navegar("/perfil");
  };

  const cerrarSesion = () => {
    auth.signOut().then(() => {
      navegar("/");
    }).catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
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
          <Navbar.Brand as={Link} to="/MisSuscripciones" className="me-0">
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
              <Nav.Link as={Link} to="/">
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
                {usuarioActivo ? (
                  <>
                    <NavDropdown 
                      title={
                        <>
                          <FaUserCircle className="icono-usuario" />
                          <span className="nombre-usuario">{usuarioActivo.name}</span>
                        </>
                      } 
                      id="menu-usuario"
                    >
                      <NavDropdown.Item as={Link} to="/perfil">Mi Perfil</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/MisSuscripciones">Mis Suscripciones</NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={cerrarSesion}>Cerrar Sesión</NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={irALogin}
                      className="btn-iniciar-sesion btn-transparente me-2"
                    >
                      Iniciar sesión
                    </Button>
                  </>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};
