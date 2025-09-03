'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AppointmentManagementCard } from '@/components/doctor/appointment-management-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useDoctorAppointments } from '@/hooks/use-api';
import { Calendar } from 'lucide-react';

export default function DoctorDashboard() {
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [page, setPage] = useState(1);
  
  const { data: appointmentsData, isLoading } = useDoctorAppointments(status, date, page);
  
  const appointments = appointmentsData?.data || [];
  const pagination = appointmentsData?.pagination;

  const today = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout
      title="My Appointments"
      description="Manage your patient appointments and update their status."
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="date-filter">Filter by Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="date-filter"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <Label htmlFor="status-filter">Filter by Status</Label>
            <Select value={status} onValueChange={(value) => {
              setStatus(value === 'all' ? '' : value);
              setPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Appointments List */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner className="w-8 h-8" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No appointments found for the selected criteria.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentManagementCard key={appointment.id} appointment={appointment} />
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