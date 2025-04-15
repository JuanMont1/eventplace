import React from 'react';
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../archivos/img/logo.png";
import { useAuth } from '../contexts/AuthContext'; // Asegúrate de que la ruta de importación sea correcta

export const BarraNavegacionAdmin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleProfileClick = () => {
    navigate('/admin/perfil');
  };

  return (
    <Navbar expand="lg" className="barra-personalizada barra-admin">
      <Container fluid>
        <Navbar.Brand as={Link} to="/admin-dashboard">
          <img src={logo} alt="Logo" className="logo-barra" />
          <span className="ms-2">Panel de Administración</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin-eventos">Gestionar Eventos</Nav.Link>
            <Nav.Link as={Link} to="/admin-usuarios">Gestionar Usuarios</Nav.Link>
            <Nav.Link as={Link} to="/admin-reportes">Reportes</Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title={user ? `Admin: ${user.name || user.email}` : 'Cargando...'} id="admin-nav-dropdown">
              <NavDropdown.Item as={Link} to="/admin/perfil">Ver Perfil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};