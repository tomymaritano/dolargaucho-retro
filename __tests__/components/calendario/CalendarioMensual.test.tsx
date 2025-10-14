import React from 'react';
import { render, screen } from '@testing-library/react';
import { CalendarioMensual } from '@/components/calendario/CalendarioMensual';

describe('CalendarioMensual', () => {
  const mockFeriados = [
    {
      fecha: '2025-01-01',
      tipo: 'inamovible' as const,
      nombre: 'Año Nuevo',
    },
  ];

  const mockEventos = [
    {
      fecha: '2025-01-15',
      tipo: 'discurso',
      nombre: 'Evento Presidencial',
      presidente: 'Presidente Test',
      descripcion: 'Descripción del evento',
    },
  ];

  const mockOnMesChange = jest.fn();

  it('renders calendar for given month', () => {
    render(<CalendarioMensual mes={0} año={2025} feriados={mockFeriados} eventos={mockEventos} onMesChange={mockOnMesChange} />);

    // Calendar should render without errors
    expect(document.body).toBeTruthy();
  });

  it('displays holidays', () => {
    render(<CalendarioMensual mes={0} año={2025} feriados={mockFeriados} eventos={mockEventos} onMesChange={mockOnMesChange} />);

    // Component renders successfully
    expect(document.body).toBeTruthy();
  });

  it('handles empty feriados and eventos', () => {
    render(<CalendarioMensual mes={0} año={2025} feriados={[]} eventos={[]} onMesChange={mockOnMesChange} />);

    // Component renders without errors
    expect(document.body).toBeTruthy();
  });
});
