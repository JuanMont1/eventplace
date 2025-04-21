
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BarraNavegacion } from "./Components/BarraNavegacion";
import { BarraNavegacion2 } from './Components/BarraNavegacion2';
import { BarraNavegacionAdmin } from './Components/BarraNavegacionAdmin';
import PieDePagina from './Components/pieDePagina';
import UserProfile from './Components/UserProfile';
import Login from './Components/Login';
import Register from './Components/register';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation} from 'react-router-dom';
import MisSuscripciones from './Components/MisSuscripciones';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProximosEventos from './Components/proximos-eventos';
import GaleriaEventos from './Components/galeriaDeeventos';
import AdminPage from './Components/AdminPage';
import PaginaCalendario from './Components/PaginaCalendario';
import PaginaPrincipal from './Components/PaginaPrincipal';
import ForoEventos from './Components/ForoEventos';

// rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppContent = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname === '/login';
  const hideLayout = ['/login', '/register', '/perfil', '/proximos-eventos', '/eventos', '/admin/perfil','/foro/eventos'].includes(location.pathname);

  return (
    <div className="App">
      {!hideLayout && !isLoginRoute && (
        isAdminRoute ? <BarraNavegacionAdmin /> : (user ? <BarraNavegacion2 /> : <BarraNavegacion />)
      )}
      <Routes>
        <Route path="/" element={<PaginaPrincipal />} />
        <Route path="/calendario" element={<PaginaCalendario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/MisSuscripciones" element={
          <ProtectedRoute>
            <MisSuscripciones />
          </ProtectedRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="/admin/perfil" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="/mis-suscripciones" element={<MisSuscripciones />} />
        <Route path="/proximos-eventos" element={<ProximosEventos />} />
        <Route path="/eventos" element={<GaleriaEventos />} />
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="/foro/eventos" element={
          <ProtectedRoute>
            <ForoEventos />
          </ProtectedRoute>
        } />
      </Routes>
      {!hideLayout && !isLoginRoute && <PieDePagina />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
