
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from "./Components/NavBar";
import CalendarSection from "./Components/CalendarSection";



function App() {
  return (
    <div className="App">
      <NavBar/>
      <CalendarSection />
    </div>
  );
}

export default App;
