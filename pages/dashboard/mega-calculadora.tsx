import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { MegaCalculadora } from '@/components/calculadoras/MegaCalculadora';

export default function MegaCalculadoraPage() {
  return (
    <DashboardLayout>
      <MegaCalculadora />
    </DashboardLayout>
  );
}
