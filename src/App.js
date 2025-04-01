
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from "./Components/NavBar";
import CalendarSection from "./Components/CalendarSection";
import Slider from "./Components/Slider";
import Footer from './Components/Footer';
import Eventos from './Components/Eventos';



function App() {
  return (
    <div className="App">
      <NavBar/>
      <CalendarSection />
      <Slider />
      <Eventos/>
      <Footer/>
      
    </div>
    
  );
}

export default App;
