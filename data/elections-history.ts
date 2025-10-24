/**
 * Historical Election Data
 *
 * Datos históricos de elecciones presidenciales de Argentina
 * Fuente: Dirección Nacional Electoral (DINE)
 */

export interface HistoricalCandidate {
  id: number;
  fullName: string;
  party: string;
  partyColor: string;
  votes: number;
  percentage: number;
}

export interface HistoricalElection {
  year: number;
  date: string; // Format: "DD de Mes YYYY"
  turnout: number; // Participación %
  hadBallotage: boolean;
  ballotageDate?: string;
  winner: HistoricalCandidate;
  candidates: HistoricalCandidate[]; // Sorted by votes DESC
  totalVotes: number;
  totalValidVotes: number;
}

/**
 * Elecciones Presidenciales 2023
 * Fuente: https://www.electoral.gob.ar/
 */
export const ELECTION_2023: HistoricalElection = {
  year: 2023,
  date: '22 de octubre 2023',
  turnout: 76.38,
  hadBallotage: true,
  ballotageDate: '19 de noviembre 2023',
  totalVotes: 25840234,
  totalValidVotes: 24529201,
  winner: {
    id: 1,
    fullName: 'Javier Milei / Victoria Villarruel',
    party: 'La Libertad Avanza',
    partyColor: '#6B4C9A',
    votes: 14462399,
    percentage: 55.95, // Ballotage
  },
  candidates: [
    {
      id: 1,
      fullName: 'Javier Milei / Victoria Villarruel',
      party: 'La Libertad Avanza',
      partyColor: '#6B4C9A',
      votes: 14462399,
      percentage: 55.95,
    },
    {
      id: 2,
      fullName: 'Sergio Massa / Agustín Rossi',
      party: 'Unión por la Patria',
      partyColor: '#87CEEB',
      votes: 11384648,
      percentage: 44.05,
    },
    {
      id: 3,
      fullName: 'Patricia Bullrich / Luis Petri',
      party: 'Juntos por el Cambio',
      partyColor: '#FFD700',
      votes: 6214943,
      percentage: 23.83, // Primera vuelta
    },
    {
      id: 4,
      fullName: 'Juan Schiaretti / Florencio Randazzo',
      party: 'Hacemos por Nuestro País',
      partyColor: '#FF6B6B',
      votes: 1715025,
      percentage: 6.57, // Primera vuelta
    },
  ],
};

/**
 * Elecciones Presidenciales 2019
 * Fuente: https://www.electoral.gob.ar/
 */
export const ELECTION_2019: HistoricalElection = {
  year: 2019,
  date: '27 de octubre 2019',
  turnout: 80.98,
  hadBallotage: false,
  totalVotes: 25892031,
  totalValidVotes: 24651380,
  winner: {
    id: 1,
    fullName: 'Alberto Fernández / Cristina Fernández',
    party: 'Frente de Todos',
    partyColor: '#3498DB',
    votes: 12150656,
    percentage: 48.24,
  },
  candidates: [
    {
      id: 1,
      fullName: 'Alberto Fernández / Cristina Fernández',
      party: 'Frente de Todos',
      partyColor: '#3498DB',
      votes: 12150656,
      percentage: 48.24,
    },
    {
      id: 2,
      fullName: 'Mauricio Macri / Miguel Ángel Pichetto',
      party: 'Juntos por el Cambio',
      partyColor: '#FFD700',
      votes: 10317319,
      percentage: 40.28,
    },
    {
      id: 3,
      fullName: 'Roberto Lavagna / Juan Manuel Urtubey',
      party: 'Consenso Federal',
      partyColor: '#95A5A6',
      votes: 1640519,
      percentage: 6.22,
    },
    {
      id: 4,
      fullName: 'Nicolás del Caño / Romina del Plá',
      party: 'Frente de Izquierda',
      partyColor: '#E74C3C',
      votes: 666548,
      percentage: 2.53,
    },
  ],
};

/**
 * Elecciones Presidenciales 2015
 * Fuente: https://www.electoral.gob.ar/
 */
export const ELECTION_2015: HistoricalElection = {
  year: 2015,
  date: '25 de octubre 2015',
  turnout: 81.08,
  hadBallotage: true,
  ballotageDate: '22 de noviembre 2015',
  totalVotes: 25688471,
  totalValidVotes: 24451702,
  winner: {
    id: 1,
    fullName: 'Mauricio Macri / Gabriela Michetti',
    party: 'Cambiemos',
    partyColor: '#FFD700',
    votes: 12997545,
    percentage: 51.34, // Ballotage
  },
  candidates: [
    {
      id: 1,
      fullName: 'Mauricio Macri / Gabriela Michetti',
      party: 'Cambiemos',
      partyColor: '#FFD700',
      votes: 12997545,
      percentage: 51.34,
    },
    {
      id: 2,
      fullName: 'Daniel Scioli / Carlos Zannini',
      party: 'Frente para la Victoria',
      partyColor: '#3498DB',
      votes: 12317504,
      percentage: 48.66,
    },
    {
      id: 3,
      fullName: 'Sergio Massa / Gustavo Sáenz',
      party: 'Frente Renovador',
      partyColor: '#95A5A6',
      votes: 5336088,
      percentage: 21.39, // Primera vuelta
    },
    {
      id: 4,
      fullName: 'Nicolás del Caño / Myriam Bregman',
      party: 'Frente de Izquierda',
      partyColor: '#E74C3C',
      votes: 799708,
      percentage: 3.23, // Primera vuelta
    },
  ],
};

/**
 * Elecciones Presidenciales 2011
 * Fuente: https://www.electoral.gob.ar/
 */
export const ELECTION_2011: HistoricalElection = {
  year: 2011,
  date: '23 de octubre 2011',
  turnout: 79.36,
  hadBallotage: false,
  totalVotes: 23649943,
  totalValidVotes: 22526815,
  winner: {
    id: 1,
    fullName: 'Cristina Fernández / Amado Boudou',
    party: 'Frente para la Victoria',
    partyColor: '#3498DB',
    votes: 12152545,
    percentage: 54.11,
  },
  candidates: [
    {
      id: 1,
      fullName: 'Cristina Fernández / Amado Boudou',
      party: 'Frente para la Victoria',
      partyColor: '#3498DB',
      votes: 12152545,
      percentage: 54.11,
    },
    {
      id: 2,
      fullName: 'Hermes Binner / Norma Morandini',
      party: 'FAP',
      partyColor: '#E74C3C',
      votes: 3254367,
      percentage: 16.81,
    },
    {
      id: 3,
      fullName: 'Ricardo Alfonsín / Juan Carlos Marino',
      party: 'UCR',
      partyColor: '#E74C3C',
      votes: 2442070,
      percentage: 11.14,
    },
    {
      id: 4,
      fullName: 'Alberto Rodríguez Saá / Adolfo Rodríguez Saá',
      party: 'Compromiso Federal',
      partyColor: '#95A5A6',
      votes: 1747072,
      percentage: 7.96,
    },
  ],
};

/**
 * Elecciones Presidenciales 2007
 * Fuente: https://www.electoral.gob.ar/
 */
export const ELECTION_2007: HistoricalElection = {
  year: 2007,
  date: '28 de octubre 2007',
  turnout: 76.16,
  hadBallotage: false,
  totalVotes: 22536978,
  totalValidVotes: 21381372,
  winner: {
    id: 1,
    fullName: 'Cristina Fernández / Julio Cobos',
    party: 'Frente para la Victoria',
    partyColor: '#3498DB',
    votes: 9735985,
    percentage: 45.29,
  },
  candidates: [
    {
      id: 1,
      fullName: 'Cristina Fernández / Julio Cobos',
      party: 'Frente para la Victoria',
      partyColor: '#3498DB',
      votes: 9735985,
      percentage: 45.29,
    },
    {
      id: 2,
      fullName: 'Elisa Carrió / Rubén Giustiniani',
      party: 'Coalición Cívica',
      partyColor: '#F39C12',
      votes: 4876783,
      percentage: 23.04,
    },
    {
      id: 3,
      fullName: 'Roberto Lavagna / Gerardo Morales',
      party: 'Concertación',
      partyColor: '#95A5A6',
      votes: 3508931,
      percentage: 16.91,
    },
    {
      id: 4,
      fullName: 'Alberto Rodríguez Saá / Héctor Maya',
      party: 'Frente Justicia y Libertad',
      partyColor: '#95A5A6',
      votes: 1636297,
      percentage: 7.64,
    },
  ],
};

/**
 * Elecciones Presidenciales 2003
 * Fuente: https://www.electoral.gob.ar/
 */
export const ELECTION_2003: HistoricalElection = {
  year: 2003,
  date: '27 de abril 2003',
  turnout: 78.21,
  hadBallotage: false, // Menem renunció antes del ballotage
  totalVotes: 18910590,
  totalValidVotes: 17976519,
  winner: {
    id: 1,
    fullName: 'Néstor Kirchner / Daniel Scioli',
    party: 'Frente para la Victoria',
    partyColor: '#3498DB',
    votes: 4232052,
    percentage: 22.24,
  },
  candidates: [
    {
      id: 1,
      fullName: 'Néstor Kirchner / Daniel Scioli',
      party: 'Frente para la Victoria',
      partyColor: '#3498DB',
      votes: 4232052,
      percentage: 22.24,
    },
    {
      id: 2,
      fullName: 'Carlos Menem / Juan Carlos Romero',
      party: 'Frente por la Lealtad',
      partyColor: '#6B4C9A',
      votes: 4686646,
      percentage: 24.45, // Ganó primera vuelta pero renunció
    },
    {
      id: 3,
      fullName: 'Ricardo López Murphy / Julio Martínez',
      party: 'Recrear',
      partyColor: '#E74C3C',
      votes: 3144528,
      percentage: 16.37,
    },
    {
      id: 4,
      fullName: 'Elisa Carrió / Gustavo Gutiérrez',
      party: 'ARI',
      partyColor: '#F39C12',
      votes: 2729904,
      percentage: 14.05,
    },
  ],
};

/**
 * Elecciones Presidenciales 1999
 * Fuente: https://www.electoral.gob.ar/
 */
export const ELECTION_1999: HistoricalElection = {
  year: 1999,
  date: '24 de octubre 1999',
  turnout: 81.95,
  hadBallotage: false,
  totalVotes: 18526867,
  totalValidVotes: 17632847,
  winner: {
    id: 1,
    fullName: 'Fernando de la Rúa / Carlos Alvarez',
    party: 'Alianza',
    partyColor: '#E74C3C',
    votes: 9038334,
    percentage: 48.37,
  },
  candidates: [
    {
      id: 1,
      fullName: 'Fernando de la Rúa / Carlos Alvarez',
      party: 'Alianza',
      partyColor: '#E74C3C',
      votes: 9038334,
      percentage: 48.37,
    },
    {
      id: 2,
      fullName: 'Eduardo Duhalde / Ramón Ortega',
      party: 'Partido Justicialista',
      partyColor: '#3498DB',
      votes: 7099116,
      percentage: 38.27,
    },
    {
      id: 3,
      fullName: 'Domingo Cavallo / María Eugenia Estenssoro',
      party: 'Acción por la República',
      partyColor: '#95A5A6',
      votes: 1937445,
      percentage: 10.21,
    },
  ],
};

/**
 * Elecciones Presidenciales 1995
 * Fuente: https://www.electoral.gob.ar/
 */
export const ELECTION_1995: HistoricalElection = {
  year: 1995,
  date: '14 de mayo 1995',
  turnout: 82.08,
  hadBallotage: false,
  totalVotes: 16478484,
  totalValidVotes: 15703090,
  winner: {
    id: 1,
    fullName: 'Carlos Menem / Carlos Ruckauf',
    party: 'Partido Justicialista',
    partyColor: '#3498DB',
    votes: 7963819,
    percentage: 49.94,
  },
  candidates: [
    {
      id: 1,
      fullName: 'Carlos Menem / Carlos Ruckauf',
      party: 'Partido Justicialista',
      partyColor: '#3498DB',
      votes: 7963819,
      percentage: 49.94,
    },
    {
      id: 2,
      fullName: 'José Octavio Bordón / Carlos Alvarez',
      party: 'FREPASO',
      partyColor: '#F39C12',
      votes: 4538803,
      percentage: 29.3,
    },
    {
      id: 3,
      fullName: 'Horacio Massaccesi / Rodolfo Barra',
      party: 'UCR',
      partyColor: '#E74C3C',
      votes: 2629411,
      percentage: 17.09,
    },
  ],
};

/**
 * Elecciones Presidenciales 1989
 * Fuente: https://www.electoral.gob.ar/
 */
export const ELECTION_1989: HistoricalElection = {
  year: 1989,
  date: '14 de mayo 1989',
  turnout: 85.3,
  hadBallotage: false,
  totalVotes: 15394783,
  totalValidVotes: 14694598,
  winner: {
    id: 1,
    fullName: 'Carlos Menem / Eduardo Duhalde',
    party: 'Partido Justicialista',
    partyColor: '#3498DB',
    votes: 7332784,
    percentage: 47.49,
  },
  candidates: [
    {
      id: 1,
      fullName: 'Carlos Menem / Eduardo Duhalde',
      party: 'Partido Justicialista',
      partyColor: '#3498DB',
      votes: 7332784,
      percentage: 47.49,
    },
    {
      id: 2,
      fullName: 'Eduardo Angeloz / Juan Manuel Casella',
      party: 'UCR',
      partyColor: '#E74C3C',
      votes: 5185540,
      percentage: 37.03,
    },
    {
      id: 3,
      fullName: 'Álvaro Alsogaray / Alberto Natale',
      party: 'UCD',
      partyColor: '#95A5A6',
      votes: 926924,
      percentage: 6.49,
    },
  ],
};

/**
 * Elecciones Presidenciales 1983 - Retorno a la Democracia
 * Fuente: https://www.electoral.gob.ar/
 */
export const ELECTION_1983: HistoricalElection = {
  year: 1983,
  date: '30 de octubre 1983',
  turnout: 85.58,
  hadBallotage: false,
  totalVotes: 15137027,
  totalValidVotes: 14441739,
  winner: {
    id: 1,
    fullName: 'Raúl Alfonsín / Víctor Martínez',
    party: 'UCR',
    partyColor: '#E74C3C',
    votes: 7727077,
    percentage: 51.75,
  },
  candidates: [
    {
      id: 1,
      fullName: 'Raúl Alfonsín / Víctor Martínez',
      party: 'UCR',
      partyColor: '#E74C3C',
      votes: 7727077,
      percentage: 51.75,
    },
    {
      id: 2,
      fullName: 'Ítalo Luder / Deolindo Bittel',
      party: 'Partido Justicialista',
      partyColor: '#3498DB',
      votes: 5994406,
      percentage: 40.16,
    },
    {
      id: 3,
      fullName: 'Rogelio Frigerio / Ezequiel Martínez',
      party: 'MID',
      partyColor: '#95A5A6',
      votes: 344434,
      percentage: 2.32,
    },
  ],
};

/**
 * Array con todas las elecciones históricas (ordenadas DESC)
 */
export const HISTORICAL_ELECTIONS: HistoricalElection[] = [
  ELECTION_2023,
  ELECTION_2019,
  ELECTION_2015,
  ELECTION_2011,
  ELECTION_2007,
  ELECTION_2003,
  ELECTION_1999,
  ELECTION_1995,
  ELECTION_1989,
  ELECTION_1983,
];

/**
 * Get election by year
 */
export function getElectionByYear(year: number): HistoricalElection | undefined {
  return HISTORICAL_ELECTIONS.find((e) => e.year === year);
}

// ============================================================================
// ELECCIONES LEGISLATIVAS (Diputados Nacionales)
// ============================================================================

/**
 * Resultado de un partido/coalición en elecciones legislativas
 */
export interface LegislativePartyResult {
  id: number;
  party: string;
  partyColor: string;
  votes: number;
  percentage: number;
  seats: number; // Bancas obtenidas
}

/**
 * Elección legislativa completa (Diputados Nacionales)
 */
export interface LegislativeElection {
  year: number;
  date: string; // Format: "DD de Mes YYYY"
  turnout: number; // Participación %
  seatsContested: number; // Bancas en disputa (generalmente 127 o 130)
  totalVotes: number;
  totalValidVotes: number;
  topParty: LegislativePartyResult;
  parties: LegislativePartyResult[]; // Sorted by votes DESC
}

/**
 * Elecciones Legislativas 2023
 * Fuente: Wikipedia - Elecciones legislativas de Argentina de 2023
 */
export const LEGISLATIVE_2023: LegislativeElection = {
  year: 2023,
  date: '22 de octubre 2023',
  turnout: 77.01,
  seatsContested: 130,
  totalVotes: 25840234, // Same as presidential
  totalValidVotes: 24546861,
  topParty: {
    id: 1,
    party: 'Unión por la Patria',
    partyColor: '#87CEEB',
    votes: 9298491,
    percentage: 37.89,
    seats: 58,
  },
  parties: [
    {
      id: 1,
      party: 'Unión por la Patria',
      partyColor: '#87CEEB',
      votes: 9298491,
      percentage: 37.89,
      seats: 58,
    },
    {
      id: 2,
      party: 'La Libertad Avanza',
      partyColor: '#6B4C9A',
      votes: 6843049,
      percentage: 27.88,
      seats: 35,
    },
    {
      id: 3,
      party: 'Juntos por el Cambio',
      partyColor: '#FFD700',
      votes: 6412133,
      percentage: 26.12,
      seats: 31,
    },
    {
      id: 4,
      party: 'Hacemos por Nuestro País',
      partyColor: '#FF6B6B',
      votes: 946840,
      percentage: 3.86,
      seats: 4,
    },
    {
      id: 5,
      party: 'Frente de Izquierda y de Trabajadores - Unidad',
      partyColor: '#E74C3C',
      votes: 798396,
      percentage: 3.25,
      seats: 1,
    },
  ],
};

/**
 * Elecciones Legislativas 2021
 * Fuente: Wikipedia - Elecciones legislativas de Argentina de 2021
 */
export const LEGISLATIVE_2021: LegislativeElection = {
  year: 2021,
  date: '14 de noviembre 2021',
  turnout: 71.0,
  seatsContested: 127,
  totalVotes: 24406798,
  totalValidVotes: 23260493,
  topParty: {
    id: 1,
    party: 'Juntos por el Cambio',
    partyColor: '#FFD700',
    votes: 9945804,
    percentage: 42.75,
    seats: 61,
  },
  parties: [
    {
      id: 1,
      party: 'Juntos por el Cambio',
      partyColor: '#FFD700',
      votes: 9945804,
      percentage: 42.75,
      seats: 61,
    },
    {
      id: 2,
      party: 'Frente de Todos',
      partyColor: '#3498DB',
      votes: 8041290,
      percentage: 34.56,
      seats: 50,
    },
    {
      id: 3,
      party: 'Avanza Libertad / La Libertad Avanza',
      partyColor: '#6B4C9A',
      votes: 1291999,
      percentage: 5.55,
      seats: 4,
    },
    {
      id: 4,
      party: 'Tercera Vía / Peronismo Federal',
      partyColor: '#95A5A6',
      votes: 1325494,
      percentage: 5.65,
      seats: 4,
    },
    {
      id: 5,
      party: 'Frente de Izquierda - Unidad',
      partyColor: '#E74C3C',
      votes: 1280240,
      percentage: 5.41,
      seats: 4,
    },
  ],
};

/**
 * Elecciones Legislativas 2019
 * Fuente: Wikipedia - Elecciones legislativas de Argentina de 2019
 */
export const LEGISLATIVE_2019: LegislativeElection = {
  year: 2019,
  date: '27 de octubre 2019',
  turnout: 80.41,
  seatsContested: 130,
  totalVotes: 27515686,
  totalValidVotes: 25639274,
  topParty: {
    id: 1,
    party: 'Frente de Todos',
    partyColor: '#3498DB',
    votes: 11606368,
    percentage: 45.27,
    seats: 64,
  },
  parties: [
    {
      id: 1,
      party: 'Frente de Todos',
      partyColor: '#3498DB',
      votes: 11606368,
      percentage: 45.27,
      seats: 64,
    },
    {
      id: 2,
      party: 'Juntos por el Cambio',
      partyColor: '#FFD700',
      votes: 10347402,
      percentage: 40.36,
      seats: 56,
    },
    {
      id: 3,
      party: 'Consenso Federal',
      partyColor: '#95A5A6',
      votes: 1477802,
      percentage: 5.85,
      seats: 3,
    },
    {
      id: 4,
      party: 'Frente de Izquierda y de Trabajadores - Unidad',
      partyColor: '#E74C3C',
      votes: 764489,
      percentage: 2.97,
      seats: 0,
    },
    {
      id: 5,
      party: 'Hacemos por Córdoba',
      partyColor: '#F39C12',
      votes: 377844,
      percentage: 1.47,
      seats: 1,
    },
  ],
};

/**
 * Elecciones Legislativas 2017
 * Fuente: Wikipedia - Elecciones legislativas de Argentina de 2017
 */
export const LEGISLATIVE_2017: LegislativeElection = {
  year: 2017,
  date: '22 de octubre 2017',
  turnout: 75.89,
  seatsContested: 127,
  totalVotes: 26800000, // Approximate
  totalValidVotes: 24580000, // Approximate
  topParty: {
    id: 1,
    party: 'Cambiemos',
    partyColor: '#FFD700',
    votes: 10261407,
    percentage: 41.75,
    seats: 61,
  },
  parties: [
    {
      id: 1,
      party: 'Cambiemos',
      partyColor: '#FFD700',
      votes: 10261407,
      percentage: 41.75,
      seats: 61,
    },
    {
      id: 2,
      party: 'Unidad Ciudadana',
      partyColor: '#3498DB',
      votes: 4869994,
      percentage: 19.81,
      seats: 28,
    },
    {
      id: 3,
      party: 'Frente Justicialista',
      partyColor: '#87CEEB',
      votes: 3369161,
      percentage: 13.71,
      seats: 22,
    },
    {
      id: 4,
      party: '1País',
      partyColor: '#95A5A6',
      votes: 1479268,
      percentage: 5.76,
      seats: 4,
    },
    {
      id: 5,
      party: 'Frente de Izquierda',
      partyColor: '#E74C3C',
      votes: 1156160,
      percentage: 4.7,
      seats: 2,
    },
  ],
};

/**
 * Elecciones Legislativas 2015
 * Fuente: Wikipedia - Elecciones legislativas de Argentina de 2015
 */
export const LEGISLATIVE_2015: LegislativeElection = {
  year: 2015,
  date: '25 de octubre 2015',
  turnout: 81.08,
  seatsContested: 130,
  totalVotes: 25920000, // Approximate
  totalValidVotes: 23314026,
  topParty: {
    id: 1,
    party: 'Frente para la Victoria',
    partyColor: '#3498DB',
    votes: 8765438,
    percentage: 37.6,
    seats: 60,
  },
  parties: [
    {
      id: 1,
      party: 'Frente para la Victoria',
      partyColor: '#3498DB',
      votes: 8765438,
      percentage: 37.6,
      seats: 60,
    },
    {
      id: 2,
      party: 'Cambiemos',
      partyColor: '#FFD700',
      votes: 8102381,
      percentage: 34.75,
      seats: 46,
    },
    {
      id: 3,
      party: 'Unidos por una Nueva Alternativa',
      partyColor: '#95A5A6',
      votes: 4115414,
      percentage: 17.65,
      seats: 16,
    },
    {
      id: 4,
      party: 'Frente de Izquierda y de los Trabajadores',
      partyColor: '#E74C3C',
      votes: 982953,
      percentage: 4.22,
      seats: 1,
    },
    {
      id: 5,
      party: 'Progresistas',
      partyColor: '#F39C12',
      votes: 803610,
      percentage: 3.45,
      seats: 2,
    },
  ],
};

/**
 * Elecciones Legislativas 2013
 * Fuente: Wikipedia - Elecciones legislativas de Argentina de 2013
 */
export const LEGISLATIVE_2013: LegislativeElection = {
  year: 2013,
  date: '27 de octubre 2013',
  turnout: 77.64,
  seatsContested: 127,
  totalVotes: 24800000, // Approximate
  totalValidVotes: 22614402,
  topParty: {
    id: 1,
    party: 'Frente para la Victoria',
    partyColor: '#3498DB',
    votes: 7425261,
    percentage: 32.83,
    seats: 45,
  },
  parties: [
    {
      id: 1,
      party: 'Frente para la Victoria',
      partyColor: '#3498DB',
      votes: 7425261,
      percentage: 32.83,
      seats: 45,
    },
    {
      id: 2,
      party: 'Frente Progresista Cívico y Social',
      partyColor: '#E74C3C',
      votes: 5510949,
      percentage: 24.37,
      seats: 36,
    },
    {
      id: 3,
      party: 'Frente Renovador',
      partyColor: '#95A5A6',
      votes: 4087402,
      percentage: 18.06,
      seats: 16,
    },
    {
      id: 4,
      party: 'Propuesta Republicana (PRO)',
      partyColor: '#FFD700',
      votes: 1974049,
      percentage: 8.73,
      seats: 12,
    },
    {
      id: 5,
      party: 'Frente de Izquierda',
      partyColor: '#E74C3C',
      votes: 1211252,
      percentage: 5.36,
      seats: 3,
    },
  ],
};

/**
 * Elecciones Legislativas 2011
 * Fuente: Wikipedia - Elecciones legislativas de Argentina de 2011
 */
export const LEGISLATIVE_2011: LegislativeElection = {
  year: 2011,
  date: '23 de octubre 2011',
  turnout: 79.36,
  seatsContested: 130,
  totalVotes: 23649943,
  totalValidVotes: 20575715,
  topParty: {
    id: 1,
    party: 'Frente para la Victoria',
    partyColor: '#3498DB',
    votes: 10793689,
    percentage: 52.46,
    seats: 86,
  },
  parties: [
    {
      id: 1,
      party: 'Frente para la Victoria',
      partyColor: '#3498DB',
      votes: 10793689,
      percentage: 52.46,
      seats: 86,
    },
    {
      id: 2,
      party: 'Frente Amplio Progresista',
      partyColor: '#E74C3C',
      votes: 2780984,
      percentage: 13.52,
      seats: 14,
    },
    {
      id: 3,
      party: 'Unión para el Desarrollo Social',
      partyColor: '#95A5A6',
      votes: 2774548,
      percentage: 13.49,
      seats: 16,
    },
    {
      id: 4,
      party: 'Frente Popular - Propuesta Republicana',
      partyColor: '#FFD700',
      votes: 1424685,
      percentage: 6.92,
      seats: 5,
    },
    {
      id: 5,
      party: 'Compromiso Federal',
      partyColor: '#87CEEB',
      votes: 1218949,
      percentage: 5.93,
      seats: 6,
    },
  ],
};

/**
 * Elecciones Legislativas 2009
 * Fuente: Wikipedia - Elecciones legislativas de Argentina de 2009
 */
export const LEGISLATIVE_2009: LegislativeElection = {
  year: 2009,
  date: '28 de junio 2009',
  turnout: 75.35,
  seatsContested: 127,
  totalVotes: 22400000, // Approximate
  totalValidVotes: 19330000, // Approximate
  topParty: {
    id: 1,
    party: 'Acuerdo Cívico y Social',
    partyColor: '#F39C12',
    votes: 5705105,
    percentage: 29.52,
    seats: 46,
  },
  parties: [
    {
      id: 1,
      party: 'Acuerdo Cívico y Social',
      partyColor: '#F39C12',
      votes: 5705105,
      percentage: 29.52,
      seats: 46,
    },
    {
      id: 2,
      party: 'Frente para la Victoria',
      partyColor: '#3498DB',
      votes: 5544069,
      percentage: 28.69,
      seats: 42,
    },
    {
      id: 3,
      party: 'Unión PRO',
      partyColor: '#FFD700',
      votes: 3675747,
      percentage: 19.02,
      seats: 23,
    },
    {
      id: 4,
      party: 'Peronismo Federal',
      partyColor: '#87CEEB',
      votes: 1560298,
      percentage: 8.07,
      seats: 11,
    },
    {
      id: 5,
      party: 'Movimiento Proyecto Sur',
      partyColor: '#95A5A6',
      votes: 448711,
      percentage: 2.32,
      seats: 4,
    },
  ],
};

/**
 * Elecciones Legislativas 2007
 * Fuente: Wikipedia - Elecciones legislativas de Argentina de 2007
 */
export const LEGISLATIVE_2007: LegislativeElection = {
  year: 2007,
  date: '28 de octubre 2007',
  turnout: 76.16,
  seatsContested: 130,
  totalVotes: 22536978,
  totalValidVotes: 18448374, // Approximate based on percentages
  topParty: {
    id: 1,
    party: 'Frente para la Victoria',
    partyColor: '#3498DB',
    votes: 8524699,
    percentage: 46.21,
    seats: 84,
  },
  parties: [
    {
      id: 1,
      party: 'Frente para la Victoria',
      partyColor: '#3498DB',
      votes: 8524699,
      percentage: 46.21,
      seats: 84,
    },
    {
      id: 2,
      party: 'Coalición Cívica',
      partyColor: '#F39C12',
      votes: 3606840,
      percentage: 18.83,
      seats: 23,
    },
    {
      id: 3,
      party: 'Una Nación Avanzada',
      partyColor: '#95A5A6',
      votes: 2741843,
      percentage: 15.16,
      seats: 12,
    },
    {
      id: 4,
      party: 'Propuesta Republicana',
      partyColor: '#FFD700',
      votes: 1102035,
      percentage: 6.09,
      seats: 6,
    },
    {
      id: 5,
      party: 'FREJULI',
      partyColor: '#87CEEB',
      votes: 972391,
      percentage: 5.37,
      seats: 3,
    },
  ],
};

/**
 * Array con todas las elecciones legislativas históricas (ordenadas DESC)
 */
export const HISTORICAL_LEGISLATIVE_ELECTIONS: LegislativeElection[] = [
  LEGISLATIVE_2023,
  LEGISLATIVE_2021,
  LEGISLATIVE_2019,
  LEGISLATIVE_2017,
  LEGISLATIVE_2015,
  LEGISLATIVE_2013,
  LEGISLATIVE_2011,
  LEGISLATIVE_2009,
  LEGISLATIVE_2007,
];

/**
 * Get legislative election by year
 */
export function getLegislativeElectionByYear(year: number): LegislativeElection | undefined {
  return HISTORICAL_LEGISLATIVE_ELECTIONS.find((e) => e.year === year);
}
