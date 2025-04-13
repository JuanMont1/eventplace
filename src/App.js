
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BarraNavegacion } from "./Components/BarraNavegacion";
import { BarraNavegacion2 } from './Components/BarraNavegacion2';
import CalendarSection from "./Components/CalendarSection";
import Slider from "./Components/Slider";
import PieDePagina from './Components/pieDePagina';
import Eventos from './Components/Eventos';
import UserProfile from './Components/UserProfile';
import Login from './Components/Login';
import Register from './Components/register';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation} from 'react-router-dom';
import MisSuscripciones from './Components/MisSuscripciones';
import { AuthProvider, useAuth } from './contexts/AuthContext';


// rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};


const AppContent = () => {
  const location = useLocation();
  const { user } = useAuth();
  const hideLayout = ['/login', '/register', '/perfil'].includes(location.pathname);

  return (
    <div className="App">
      {!hideLayout && (user ? <BarraNavegacion2 /> : <BarraNavegacion />)}
      <Routes>
        <Route path="/" element={
          <div className="main-content">
            <CalendarSection />
            <Slider />
            <Eventos />
          </div>
        } />
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
        <Route path="/mis-suscripciones" element={<MisSuscripciones />} />
      </Routes>
      {!hideLayout && <PieDePagina />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
