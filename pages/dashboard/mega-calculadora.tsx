import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { MegaCalculadora } from '@/components/calculadoras/MegaCalculadora';
import { PageHeader } from '@/components/ui/PageHeader';
import { FaChartLine } from 'react-icons/fa';

export default function MegaCalculadoraPage() {
  return (
    <DashboardLayout>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Calculadoras', href: '/dashboard/calculadoras' },
          { label: 'Mega Calculadora' },
        ]}
        icon={FaChartLine}
        title="Mega Calculadora"
        description="Compara todos los activos financieros y encuentra la mejor opción de inversión"
      />
      <MegaCalculadora />
    </DashboardLayout>
  );
}
