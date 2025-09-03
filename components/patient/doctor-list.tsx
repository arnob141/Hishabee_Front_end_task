'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DoctorCard } from './doctor-card';
import { useDoctors, useSpecializations } from '@/hooks/use-api';
import { Search } from 'lucide-react';

export function DoctorList() {
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [page, setPage] = useState(1);
  
  const { data: doctorsData, isLoading } = useDoctors(page, 9, search, specialization);
  const { data: specializations = [] } = useSpecializations();

  const doctors = doctorsData?.data || [];
  const pagination = doctorsData?.pagination;

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search doctors by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to first page on search
            }}
            className="pl-10"
          />
        </div>
        
        <Select 
          value={specialization} 
          onValueChange={(value) => {
            setSpecialization(value === 'all' ? '' : value);
            setPage(1); // Reset to first page on filter
          }}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Filter by specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specializations</SelectItem>
            {specializations.map((spec) => (
              <SelectItem key={spec} value={spec}>
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Doctor Grid */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner className="w-8 h-8" />
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No doctors found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
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
  );
}