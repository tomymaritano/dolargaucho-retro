import { DolarDashboard } from '@/components/DolarDashboard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

/**
 * Demo Page
 * Showcases the new components and React Query integration
 */
export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-dark-light to-dark text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Dashboard <span className="gradient-text">Profesional</span>
          </h1>
          <p className="text-secondary text-lg max-w-7xl mx-auto">
            Demo de componentes con CVA y TanStack Query
          </p>
        </div>

        {/* Component Examples */}
        <div className="space-y-8 mb-12">
          {/* Button Examples */}
          <Card variant="elevated" padding="lg">
            <Card.Header>
              <Card.Title>Componentes Button</Card.Title>
              <Card.Description>Variantes de botones con CVA</Card.Description>
            </Card.Header>

            <Card.Content>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <Button variant="primary" size="xs">
                  Extra Small
                </Button>
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <Button variant="primary" size="md">
                  Medium
                </Button>
                <Button variant="primary" size="lg">
                  Large
                </Button>
              </div>

              <div className="mt-4">
                <Button variant="primary" fullWidth>
                  Full Width Button
                </Button>
              </div>

              <div className="flex gap-3 mt-4">
                <Button variant="primary" isLoading>
                  Loading...
                </Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </div>
            </Card.Content>
          </Card>

          {/* Card Examples */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="default" padding="md" hover="scale">
              <Card.Header>
                <Card.Title>Default Card</Card.Title>
                <Card.Description>Glass-strong variant</Card.Description>
              </Card.Header>
              <Card.Content>
                <p className="text-sm text-secondary">
                  This is the default card style with glass-strong effect.
                </p>
              </Card.Content>
            </Card>

            <Card variant="outlined" padding="md" hover="glow">
              <Card.Header>
                <Card.Title>Outlined Card</Card.Title>
                <Card.Description>With emerald border</Card.Description>
              </Card.Header>
              <Card.Content>
                <p className="text-sm text-secondary">Outlined variant with accent border.</p>
              </Card.Content>
            </Card>

            <Card variant="elevated" padding="md" hover="lift">
              <Card.Header>
                <Card.Title>Elevated Card</Card.Title>
                <Card.Description>With shadow</Card.Description>
              </Card.Header>
              <Card.Content>
                <p className="text-sm text-secondary">Elevated variant with extra shadow.</p>
              </Card.Content>
              <Card.Footer>
                <Button variant="outline" size="sm" fullWidth>
                  Action
                </Button>
              </Card.Footer>
            </Card>
          </div>
        </div>

        {/* Main Dashboard with React Query */}
        <DolarDashboard />

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-secondary">Powered by TanStack Query + CVA + Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}
