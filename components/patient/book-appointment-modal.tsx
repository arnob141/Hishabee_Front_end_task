'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Doctor } from '@/lib/types';
import { useCreateAppointment } from '@/hooks/use-api';
import { appointmentSchema, AppointmentFormData } from '@/lib/schemas';
import { toast } from 'sonner';

interface BookAppointmentModalProps {
  doctor: Doctor;
  open: boolean;
  onClose: () => void;
}

export function BookAppointmentModal({ doctor, open, onClose }: BookAppointmentModalProps) {
  const createAppointmentMutation = useCreateAppointment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctorId: doctor.id,
    },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      await createAppointmentMutation.mutateAsync(data);
      toast.success('Appointment booked successfully!');
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Format date for input (min is today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Appointment with Dr. {doctor.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="text-center py-4 border rounded-lg bg-gray-50">
            <p className="font-medium text-gray-900">{doctor.name}</p>
            <p className="text-sm text-gray-600">{doctor.specialization}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appointment-date">Appointment Date</Label>
            <Input
              id="appointment-date"
              type="date"
              min={today}
              {...register('date')}
              className={errors.date ? 'border-red-500' : ''}
            />
            {errors.date && (
              <p className="text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={createAppointmentMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createAppointmentMutation.isPending}
            >
              {createAppointmentMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner className="w-4 h-4" />
                  <span>Booking...</span>
                </div>
              ) : (
                'Book Appointment'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}