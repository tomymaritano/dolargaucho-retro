/**
 * Mock for lightweight-charts library
 * Used in Jest tests to avoid canvas dependencies
 */

const mockSeries = {
  setData: jest.fn(),
  update: jest.fn(),
  priceScale: jest.fn(() => ({
    applyOptions: jest.fn(),
  })),
  applyOptions: jest.fn(),
};

const mockTimeScale = {
  fitContent: jest.fn(),
  scrollToPosition: jest.fn(),
  applyOptions: jest.fn(),
  timeToCoordinate: jest.fn(),
  coordinateToTime: jest.fn(),
};

const mockChart = {
  addSeries: jest.fn(() => mockSeries),
  removeSeries: jest.fn(),
  timeScale: jest.fn(() => mockTimeScale),
  priceScale: jest.fn(() => ({
    applyOptions: jest.fn(),
  })),
  applyOptions: jest.fn(),
  remove: jest.fn(),
  resize: jest.fn(),
  takeScreenshot: jest.fn(),
  subscribeClick: jest.fn(),
  subscribeCrosshairMove: jest.fn(),
  unsubscribeClick: jest.fn(),
  unsubscribeCrosshairMove: jest.fn(),
};

module.exports = {
  createChart: jest.fn(() => mockChart),

  // Enums
  ColorType: {
    Solid: 0,
    VerticalGradient: 1,
  },

  LineStyle: {
    Solid: 0,
    Dotted: 1,
    Dashed: 2,
    LargeDashed: 3,
    SparseDotted: 4,
  },

  CrosshairMode: {
    Normal: 0,
    Magnet: 1,
  },

  PriceScaleMode: {
    Normal: 0,
    Logarithmic: 1,
    Percentage: 2,
    IndexedTo100: 3,
  },

  // Series constructors (as strings since that's how they're used)
  CandlestickSeries: 'Candlestick',
  LineSeries: 'Line',
  AreaSeries: 'Area',
  BarSeries: 'Bar',
  HistogramSeries: 'Histogram',
  BaselineSeries: 'Baseline',
};
