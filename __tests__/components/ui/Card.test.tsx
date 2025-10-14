import { render, screen } from '@testing-library/react';
import { Card } from '@/components/ui/Card/Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        <p>Test</p>
      </Card>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with glass-strong effect by default', () => {
    const { container } = render(
      <Card>
        <p>Test</p>
      </Card>
    );
    expect(container.firstChild).toHaveClass('glass-strong');
  });

  it('applies different variants', () => {
    const { container, rerender } = render(
      <Card variant="outlined">
        <p>Test</p>
      </Card>
    );
    expect(container.firstChild).toHaveClass('border-2');

    rerender(
      <Card variant="elevated">
        <p>Test</p>
      </Card>
    );
    expect(container.firstChild).toHaveClass('glass-strong');
  });
});
