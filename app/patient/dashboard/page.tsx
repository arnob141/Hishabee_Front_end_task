'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DoctorList } from '@/components/patient/doctor-list';

export default function PatientDashboard() {
  return (
    <DashboardLayout
      title="Find a Doctor"
      description="Browse our network of qualified healthcare professionals and book your appointment."
    >
      <DoctorList />
    </DashboardLayout>
  );
}