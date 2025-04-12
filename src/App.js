import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BarraNavegacion } from "./Components/BarraNavegacion";
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
              <BarraNavegacion />
              <CalendarSection />
              <Slider />
              <Eventos />
              <Footer />
            </div>
          } />

          {/* Rutas*/}
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/register" element={<Register />} />
 
           </Routes>
        
      </div>
    </Router>
  );
}

export default App;
