let mockEventos = JSON.parse(localStorage.getItem('mockEventos')) || [];

export const getMockEventos = () => {
  return mockEventos;
};

export const addMockEvento = (nuevoEvento) => {
  const eventoConId = { ...nuevoEvento, id: Date.now().toString() };
  mockEventos.push(eventoConId);
  // Guardar en localStorage
  localStorage.setItem('mockEventos', JSON.stringify(mockEventos));
  return eventoConId;
};

export const deleteMockEvento = (id) => {
  mockEventos = mockEventos.filter(evento => evento.id !== id);
  // Actualizar localStorage
  localStorage.setItem('mockEventos', JSON.stringify(mockEventos));
};

// Si quieres inicializar con algunos eventos por defecto, puedes hacerlo así:
if (mockEventos.length === 0) {
  const eventosIniciales = [
    // ... tus eventos iniciales ...
  ];
  eventosIniciales.forEach(addMockEvento);
}