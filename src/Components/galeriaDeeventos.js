import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Asegúrate de que esta ruta sea correcta
import '../styles/GaleriaEventos.css';

const GaleriaEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventos = async () => {
      const eventosCollection = collection(db, 'eventosPasados');
      const eventosSnapshot = await getDocs(eventosCollection);
      const eventosList = eventosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Eventos obtenidos:', eventosList); // Agregamos este log para depuración
      setEventos(eventosList);
    };

    fetchEventos();
  }, []);

  const imagenesEventos = [
    'https://noticias.udec.cl/wp-content/uploads/2022/09/CADEC-06-1024x683.jpg',
    'https://noticias.udec.cl/wp-content/uploads/2022/09/CADEC-06-1024x683.jpg',
    // ... más URLs de imágenes ...
  ];

  const generarEventosEjemplo = () => {
    const categorias = ['Académico', 'Cultural', 'Deportivo', 'Tecnología', 'Arte'];
    const eventos = [];
    for (let i = 1; i <= 50; i++) {
      eventos.push({
        id: i,
        titulo: `Evento ${i}`,
        descripcion: `Descripción del evento ${i}. Este es un evento emocionante que no te puedes perder.`,
        fecha: new Date(2020 + Math.floor(i/12), i%12, Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
        categoria: categorias[Math.floor(Math.random() * categorias.length)],
        // Usar un servicio de imágenes de marcador de posición con una semilla única para cada evento
        imagen: imagenesEventos[Math.floor(Math.random() * imagenesEventos.length)]
      });
    }
    return eventos;
  };

  const eventosFiltrados = filtroCategoria === 'Todos' 
    ? eventos 
    : eventos.filter(evento => evento.categoria === filtroCategoria);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="galeria-eventos">
      <button onClick={handleGoBack} className="btn-regresar">
        ← Regresar
      </button>
      <h1 className="galeria-titulo">Galería de Eventos Pasados</h1>
      <p className="galeria-descripcion">
        Explora nuestra colección de eventos memorables que han dado forma a nuestra comunidad a lo largo del tiempo.
      </p>
      
      <div className="filtros-container">
        <select 
          value={filtroCategoria} 
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="filtro-select"
        >
          <option value="Todos">Todos los eventos</option>
          <option value="Académico">Académicos</option>
          <option value="Cultural">Culturales</option>
          <option value="Deportivo">Deportivos</option>
          <option value="Tecnología">Tecnología</option>
          <option value="Arte">Arte</option>
        </select>
      </div>

      <div className="eventos-grid">
        {eventosFiltrados.map(evento => (
          <div key={evento.id} className="evento-card">
            <img src={evento.imagen} alt={evento.nombre} className="evento-imagen" />
            <div className="evento-info">
              <h3 className="evento-titulo">{evento.nombre}</h3>
              <p className="evento-fecha">{evento.fecha}</p>
              <p className="evento-categoria">{evento.categoria}</p>
              <p className="evento-descripcion">{evento.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GaleriaEventos;