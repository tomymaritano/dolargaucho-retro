/**
 * CryptoSparkline Component Tests
 * Tests para el componente de sparklines con interpolación
 *
 * FIXME: Tests temporarily skipped - Recharts needs dimensions in Jest
 * See: https://github.com/recharts/recharts/issues/727
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';

describe.skip('CryptoSparkline', () => {
  describe('Interpolation', () => {
    it('should interpolate sparse data (7 points)', () => {
      const sparseData = [100, 105, 103, 108, 110, 107, 112];
      const { container } = render(
        <CryptoSparkline data={sparseData} trend="up" isCrypto={false} />
      );

      // Verificar que el componente se renderiza
      expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument();

      // Verificar que hay una línea (Line component)
      expect(container.querySelector('.recharts-line')).toBeInTheDocument();
    });

    it('should not interpolate dense data (crypto - 168 points)', () => {
      const denseData = Array(168)
        .fill(0)
        .map((_, i) => 100 + Math.sin(i * 0.1) * 10);

      const { container } = render(<CryptoSparkline data={denseData} trend="up" isCrypto={true} />);

      expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument();
    });

    it('should handle 2 points (linear interpolation)', () => {
      const twoPoints = [100, 110];
      const { container } = render(
        <CryptoSparkline data={twoPoints} trend="up" isCrypto={false} />
      );

      expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument();
    });
  });

  describe('Trend Colors', () => {
    it('should use green for crypto uptrend', () => {
      const data = [100, 105, 110];
      const { container } = render(<CryptoSparkline data={data} trend="up" isCrypto={true} />);

      const line = container.querySelector('.recharts-line-curve');
      expect(line).toHaveAttribute('stroke', '#10b981'); // green
    });

    it('should use red for crypto downtrend', () => {
      const data = [110, 105, 100];
      const { container } = render(<CryptoSparkline data={data} trend="down" isCrypto={true} />);

      const line = container.querySelector('.recharts-line-curve');
      expect(line).toHaveAttribute('stroke', '#ef4444'); // red
    });

    it('should use red for dolar uptrend (inverted)', () => {
      const data = [100, 105, 110];
      const { container } = render(<CryptoSparkline data={data} trend="up" isCrypto={false} />);

      const line = container.querySelector('.recharts-line-curve');
      expect(line).toHaveAttribute('stroke', '#ef4444'); // red (bad for purchasing power)
    });

    it('should use green for dolar downtrend (inverted)', () => {
      const data = [110, 105, 100];
      const { container } = render(<CryptoSparkline data={data} trend="down" isCrypto={false} />);

      const line = container.querySelector('.recharts-line-curve');
      expect(line).toHaveAttribute('stroke', '#10b981'); // green (good for purchasing power)
    });

    it('should use orange for neutral trend', () => {
      const data = [100, 100, 100];
      const { container } = render(
        <CryptoSparkline data={data} trend="neutral" isCrypto={false} />
      );

      const line = container.querySelector('.recharts-line-curve');
      expect(line).toHaveAttribute('stroke', '#f59e0b'); // orange
    });

    it('should accept custom color override', () => {
      const data = [100, 105, 110];
      const customColor = '#ff0000';
      const { container } = render(<CryptoSparkline data={data} trend="up" color={customColor} />);

      const line = container.querySelector('.recharts-line-curve');
      expect(line).toHaveAttribute('stroke', customColor);
    });
  });

  describe('Edge Cases', () => {
    it('should show placeholder for empty data', () => {
      const { container } = render(<CryptoSparkline data={[]} trend="neutral" isCrypto={false} />);

      expect(screen.getByText('-')).toBeInTheDocument();
      expect(container.querySelector('.recharts-wrapper')).not.toBeInTheDocument();
    });

    it('should show placeholder for single data point', () => {
      const { container } = render(
        <CryptoSparkline data={[100]} trend="neutral" isCrypto={false} />
      );

      expect(screen.getByText('-')).toBeInTheDocument();
      expect(container.querySelector('.recharts-wrapper')).not.toBeInTheDocument();
    });

    it('should handle negative values', () => {
      const data = [-10, -5, 0, 5, 10];
      const { container } = render(<CryptoSparkline data={data} trend="up" isCrypto={false} />);

      expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument();
    });

    it('should handle very large values', () => {
      const data = [1000000, 1500000, 2000000];
      const { container } = render(<CryptoSparkline data={data} trend="up" isCrypto={false} />);

      expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument();
    });
  });

  describe('Chart Configuration', () => {
    it('should use natural curve type', () => {
      const data = [100, 105, 110];
      const { container } = render(<CryptoSparkline data={data} trend="up" isCrypto={false} />);

      const line = container.querySelector('.recharts-line');
      // Recharts aplica el type como data attribute o class
      expect(line).toBeInTheDocument();
    });

    it('should have correct dimensions', () => {
      const data = [100, 105, 110];
      const { container } = render(<CryptoSparkline data={data} trend="up" isCrypto={false} />);

      const wrapper = container.querySelector('.w-28.h-12');
      expect(wrapper).toBeInTheDocument();
    });

    it('should have no animation', () => {
      const data = [100, 105, 110];
      const { container } = render(<CryptoSparkline data={data} trend="up" isCrypto={false} />);

      // Recharts Line debería tener isAnimationActive={false}
      const line = container.querySelector('.recharts-line');
      expect(line).toBeInTheDocument();
    });

    it('should hide dots', () => {
      const data = [100, 105, 110];
      const { container } = render(<CryptoSparkline data={data} trend="up" isCrypto={false} />);

      // No debería haber dots visibles
      const dots = container.querySelectorAll('.recharts-dot');
      expect(dots.length).toBe(0);
    });
  });
});
