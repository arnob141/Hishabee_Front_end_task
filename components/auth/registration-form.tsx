'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { patientRegistrationSchema, doctorRegistrationSchema, PatientRegistrationData, DoctorRegistrationData } from '@/lib/schemas';
import { useSpecializations } from '@/hooks/use-api';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('patient');
  const router = useRouter();

  const { data: specializations = [] } = useSpecializations();

  const patientForm = useForm<PatientRegistrationData>({
    resolver: zodResolver(patientRegistrationSchema),
  });

  const doctorForm = useForm<DoctorRegistrationData>({
    resolver: zodResolver(doctorRegistrationSchema),
  });

  const onSubmitPatient = async (data: PatientRegistrationData) => {
    setIsLoading(true);
    try {
      await api.post('/auth/register/patient', data);
      toast.success('Registration successful! Please log in.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitDoctor = async (data: DoctorRegistrationData) => {
    setIsLoading(true);
    try {
      await api.post('/auth/register/doctor', data);
      toast.success('Registration successful! Please log in.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
          <CardDescription>Choose your role and create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient">Patient</TabsTrigger>
              <TabsTrigger value="doctor">Doctor</TabsTrigger>
            </TabsList>

            <TabsContent value="patient" className="space-y-4 mt-4">
              <form onSubmit={patientForm.handleSubmit(onSubmitPatient)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-name">Full Name</Label>
                  <Input
                    id="patient-name"
                    placeholder="Enter your full name"
                    {...patientForm.register('name')}
                    className={patientForm.formState.errors.name ? 'border-red-500' : ''}
                  />
                  {patientForm.formState.errors.name && (
                    <p className="text-sm text-red-600">{patientForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient-email">Email</Label>
                  <Input
                    id="patient-email"
                    type="email"
                    placeholder="Enter your email"
                    {...patientForm.register('email')}
                    className={patientForm.formState.errors.email ? 'border-red-500' : ''}
                  />
                  {patientForm.formState.errors.email && (
                    <p className="text-sm text-red-600">{patientForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient-password">Password</Label>
                  <Input
                    id="patient-password"
                    type="password"
                    placeholder="Create a password"
                    {...patientForm.register('password')}
                    className={patientForm.formState.errors.password ? 'border-red-500' : ''}
                  />
                  {patientForm.formState.errors.password && (
                    <p className="text-sm text-red-600">{patientForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient-photo">Profile Photo URL (Optional)</Label>
                  <Input
                    id="patient-photo"
                    placeholder="https://example.com/photo.jpg"
                    {...patientForm.register('photo_url')}
                    className={patientForm.formState.errors.photo_url ? 'border-red-500' : ''}
                  />
                  {patientForm.formState.errors.photo_url && (
                    <p className="text-sm text-red-600">{patientForm.formState.errors.photo_url.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <LoadingSpinner className="w-4 h-4" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Patient Account'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="doctor" className="space-y-4 mt-4">
              <form onSubmit={doctorForm.handleSubmit(onSubmitDoctor)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor-name">Full Name</Label>
                  <Input
                    id="doctor-name"
                    placeholder="Enter your full name"
                    {...doctorForm.register('name')}
                    className={doctorForm.formState.errors.name ? 'border-red-500' : ''}
                  />
                  {doctorForm.formState.errors.name && (
                    <p className="text-sm text-red-600">{doctorForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor-email">Email</Label>
                  <Input
                    id="doctor-email"
                    type="email"
                    placeholder="Enter your email"
                    {...doctorForm.register('email')}
                    className={doctorForm.formState.errors.email ? 'border-red-500' : ''}
                  />
                  {doctorForm.formState.errors.email && (
                    <p className="text-sm text-red-600">{doctorForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor-password">Password</Label>
                  <Input
                    id="doctor-password"
                    type="password"
                    placeholder="Create a password"
                    {...doctorForm.register('password')}
                    className={doctorForm.formState.errors.password ? 'border-red-500' : ''}
                  />
                  {doctorForm.formState.errors.password && (
                    <p className="text-sm text-red-600">{doctorForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Select onValueChange={(value) => doctorForm.setValue('specialization', value)}>
                    <SelectTrigger className={doctorForm.formState.errors.specialization ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select your specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {doctorForm.formState.errors.specialization && (
                    <p className="text-sm text-red-600">{doctorForm.formState.errors.specialization.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor-photo">Profile Photo URL (Optional)</Label>
                  <Input
                    id="doctor-photo"
                    placeholder="https://example.com/photo.jpg"
                    {...doctorForm.register('photo_url')}
                    className={doctorForm.formState.errors.photo_url ? 'border-red-500' : ''}
                  />
                  {doctorForm.formState.errors.photo_url && (
                    <p className="text-sm text-red-600">{doctorForm.formState.errors.photo_url.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <LoadingSpinner className="w-4 h-4" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Doctor Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}