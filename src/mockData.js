let mockEventos = JSON.parse(localStorage.getItem('mockEventos')) || [];

export const getMockEventos = () => {
  return mockEventos;
};

export const addMockEvento = (nuevoEvento) => {
  const eventoConId = { ...nuevoEvento, id: Date.now().toString() };
  mockEventos.push(eventoConId);
  localStorage.setItem('mockEventos', JSON.stringify(mockEventos));
  return eventoConId;
};

export const deleteMockEvento = (id) => {
  mockEventos = mockEventos.filter(evento => evento.id !== id);
  localStorage.setItem('mockEventos', JSON.stringify(mockEventos));
};

export const updateMockEvento = (eventoActualizado) => {
  const index = mockEventos.findIndex(e => e.id === eventoActualizado.id);
  if (index !== -1) {
    mockEventos[index] = eventoActualizado;
    localStorage.setItem('mockEventos', JSON.stringify(mockEventos));
  }
};


if (mockEventos.length === 0) {
  const eventosIniciales = [
    // ... tus eventos iniciales ...
  ];
  eventosIniciales.forEach(addMockEvento);
}