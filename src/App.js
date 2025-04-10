import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from "./Components/NavBar";
import CalendarSection from "./Components/CalendarSection";
import Slider from "./Components/Slider";
import Footer from './Components/Footer';
import Eventos from './Components/Eventos';
import UserProfile from './Components/UserProfile';
import Login from './Components/Login';
import Register from './Components/register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/" element={
            <div className="main-content"> 
              <NavBar />
              <CalendarSection />
              <Slider />
              <Eventos />
              <Footer />
            </div>
          } />

          {/* Ruta del perfil de usuario */}
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/register" element={<Register />} />
 
           </Routes>
        
      </div>
    </Router>
  );
}

export default App;
