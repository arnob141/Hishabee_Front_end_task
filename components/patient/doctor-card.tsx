'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Doctor } from '@/lib/types';
import { BookAppointmentModal } from './book-appointment-modal';

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={doctor.photo_url} alt={doctor.name} />
              <AvatarFallback className="text-lg font-semibold">
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
              <Badge variant="secondary" className="mt-1">
                {doctor.specialization}
              </Badge>
              <p className="text-sm text-gray-600 mt-2">{doctor.email}</p>
            </div>
          </div>

          <Button 
            onClick={() => setShowBookingModal(true)}
            className="w-full mt-4"
          >
            Book Appointment
          </Button>
        </CardContent>
      </Card>

      <BookAppointmentModal 
        doctor={doctor}
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </>
  );
}