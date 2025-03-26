import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../archivos/img/logo.png";
import { FaSearch } from "react-icons/fa"; // Ícono de búsqueda
import "../styles/NavBar.css"; // Estilos personalizados

export const NavBar = () => {
  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container className="navbar-container">
        {/* Sección izquierda: Logo y "Tipo de Evento" */}
        <div className="left-section">
          <Navbar.Brand href="#home">
            <img src={logo} alt="Universidad de Cundinamarca" className="navbar-logo" />
          </Navbar.Brand>
          
          <Nav.Link href="#event-type" className="event-type-link">
            Tipo <br />
              Evento ▼
          </Nav.Link>
        </div>

        {/* Menú de navegación alineado a la derecha */}
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="nav-links">
            <Nav.Link href="#soacha">Extensión Soacha</Nav.Link>
            <Nav.Link href="#particulares">Eventos Particulares</Nav.Link>
            <Nav.Link href="#nosotros">Nosotros</Nav.Link>
            <Nav.Link href="#hoy">Hoy</Nav.Link>
            <div className="search-section">
            <FaSearch className="search-icon" />
            <span className="search-divider"></span>
          </div>
            
          </Nav>
          
        </Navbar.Collapse>
        
      </Container>
      
    </Navbar>
  );
};
