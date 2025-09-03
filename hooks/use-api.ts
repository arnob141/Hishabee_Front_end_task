import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Doctor, Appointment, PaginatedResponse, ApiResponse } from '@/lib/types';

// Doctors
export const useDoctors = (page = 1, limit = 10, search = '', specialization = '') => {
  return useQuery({
    queryKey: ['doctors', page, limit, search, specialization],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Doctor>>('/doctors', {
        params: { page, limit, search, specialization },
      });
      return response.data;
    },
  });
};

// Specializations
export const useSpecializations = () => {
  return useQuery({
    queryKey: ['specializations'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<string[]>>('/specializations');
      return response.data.data;
    },
  });
};

// Patient Appointments
export const usePatientAppointments = (status = '', page = 1) => {
  return useQuery({
    queryKey: ['patient-appointments', status, page],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Appointment>>('/appointments/patient', {
        params: { status, page, limit: 10 },
      });
      return response.data;
    },
  });
};

// Doctor Appointments  
export const useDoctorAppointments = (status = '', date = '', page = 1) => {
  return useQuery({
    queryKey: ['doctor-appointments', status, date, page],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Appointment>>('/appointments/doctor', {
        params: { status, date, page, limit: 10 },
      });
      return response.data;
    },
  });
};

// Create Appointment
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { doctorId: string; date: string }) => {
      const response = await api.post<ApiResponse<Appointment>>('/appointments', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
    },
  });
};

// Update Appointment Status
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { appointment_id: string; status: 'COMPLETED' | 'CANCELLED' }) => {
      const response = await api.patch<ApiResponse<Appointment>>('/appointments/update-status', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
    },
  });
};