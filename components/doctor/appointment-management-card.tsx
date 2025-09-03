'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Appointment } from '@/lib/types';
import { useUpdateAppointmentStatus } from '@/hooks/use-api';
import { toast } from 'sonner';
import { Calendar, User } from 'lucide-react';

interface AppointmentManagementCardProps {
  appointment: Appointment;
}

export function AppointmentManagementCard({ appointment }: AppointmentManagementCardProps) {
  const updateStatusMutation = useUpdateAppointmentStatus();

  const handleStatusUpdate = async (status: 'COMPLETED' | 'CANCELLED') => {
    const confirmMessage = status === 'COMPLETED' 
      ? 'Mark this appointment as completed?' 
      : 'Cancel this appointment?';
    
    if (window.confirm(confirmMessage)) {
      try {
        await updateStatusMutation.mutateAsync({
          appointment_id: appointment.id,
          status,
        });
        toast.success(`Appointment ${status.toLowerCase()} successfully`);
      } catch (error) {
        toast.error(`Failed to ${status.toLowerCase()} appointment`);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={appointment.patient.photo_url} alt={appointment.patient.name} />
              <AvatarFallback>
                {appointment.patient.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{appointment.patient.name}</h3>
              <p className="text-sm text-gray-600">{appointment.patient.email}</p>
              
              <div className="flex items-center space-x-1 mt-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(appointment.date)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status}
            </Badge>
            
            {appointment.status === 'PENDING' && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate('COMPLETED')}
                  disabled={updateStatusMutation.isPending}
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  Complete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate('CANCELLED')}
                  disabled={updateStatusMutation.isPending}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}