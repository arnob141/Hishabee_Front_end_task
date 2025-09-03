'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AppointmentCard } from '@/components/patient/appointment-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePatientAppointments } from '@/hooks/use-api';

export default function PatientAppointments() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  
  const { data: appointmentsData, isLoading } = usePatientAppointments(status, page);
  
  const appointments = appointmentsData?.data || [];
  const pagination = appointmentsData?.pagination;

  return (
    <DashboardLayout
      title="My Appointments"
      description="Manage your upcoming and past appointments."
    >
      <div className="space-y-6">
        {/* Status Filter */}
        <div className="flex justify-between items-center">
          <Select value={status} onValueChange={(value) => {
            setStatus(value === 'all' ? '' : value);
            setPage(1);
          }}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Appointments List */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner className="w-8 h-8" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No appointments found.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {page} of {pagination.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}