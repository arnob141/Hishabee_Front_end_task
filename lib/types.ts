export interface User {
  id: string;
  name: string;
  email: string;
  photo_url?: string;
  role: 'DOCTOR' | 'PATIENT';
  specialization?: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  photo_url?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  doctor: Doctor;
  patient: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}