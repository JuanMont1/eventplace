import { useEffect, useState } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../archivos/img/logo.png";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/NavBar.css"; // Estilos personalizados

export const NavBar = () => {
  const [scrolling, setScrolling] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para manejar la búsqueda
  const [loggedUser, setLoggedUser] = useState({ name: "Juan Pérez" }); // Estado del usuario logueado

  useEffect(() => {
    // Detecta el scroll
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Manejo de búsqueda
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    console.log("Buscando:", event.target.value);
  };

  return (
    <>
      <div className={`navbar-background ${scrolling ? "scrolled" : ""}`}></div>
      <Navbar
        expand="lg"
        className={`custom-navbar ${scrolling ? "scrolled" : ""}`}
      >
        <Container className="navbar-container">
          {/* Sección izquierda: Logo y "Tipo de Evento" */}
          <div className="left-section">
            <Navbar.Brand href="#home">
              <img
                src={logo}
                alt="Universidad de Cundinamarca"
                className={`navbar-logo ${scrolling ? "scrolled" : ""}`}
              />
            </Navbar.Brand>

            <Nav.Link href="#event-type" className="event-type-link">
              Tipo <br />
              Evento ▼
            </Nav.Link>
          </div>

          {/* Menú de navegación */}
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="nav-links">
              <Nav.Link href="#soacha">Extensión Soacha</Nav.Link>
              <Nav.Link href="#particulares">Eventos Particulares</Nav.Link>
              <Nav.Link href="#nosotros">Nosotros</Nav.Link>
              <Nav.Link href="#hoy">Hoy</Nav.Link>

              {/* Barra de búsqueda */}
              <div className="search-section">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>

              {/* Sección de usuario logueado */}
              <div className="user-section">
                <FaUserCircle className="user-icon" />
                <span className="user-name">
                  {loggedUser ? loggedUser.name : "Iniciar sesión"}
                </span>
                {loggedUser && (
                  <Link to="/UserProfile" className="profile-link">
                    Ver perfil
                  </Link>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};
