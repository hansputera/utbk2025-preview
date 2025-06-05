import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Student {
  name: string;
  utbkNumber: string;
  dob: string;
  passed: boolean;
  kip: boolean;
  ptn: string | null;
  prodi: string | null;
}

interface ApiResponse {
  data: Student[];
}

type StatusFilter = 'all' | 'passed' | 'not_passed';
type KipFilter = 'all' | 'yes' | 'no';

export default function StudentSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [kipFilter, setKipFilter] = useState<KipFilter>('all');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch students
  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ['students', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return { data: [] };
      
      const response = await fetch(`https://utbk2025-api.mnct.eu.org/students?name=${encodeURIComponent(debouncedQuery)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      return response.json();
    },
    enabled: !!debouncedQuery.trim(),
    retry: 1,
  });

  const filteredStudents = useMemo(() => {
    if (!data?.data) return [];
    
    return data.data.filter(student => {
      // Apply status filter
      if (statusFilter === 'passed' && !student.passed) return false;
      if (statusFilter === 'not_passed' && student.passed) return false;
      
      // Apply KIP filter
      if (kipFilter === 'yes' && !student.kip) return false;
      if (kipFilter === 'no' && student.kip) return false;
      
      return true;
    });
  }, [data?.data, statusFilter, kipFilter]);

  const totalStudents = data?.data?.length || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <CardTitle>Cari Siswa</CardTitle>
                <CardDescription className="mt-1">
                  Temukan informasi siswa berdasarkan nama
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>Filter:</span>
                </div>
                <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status Kelulusan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="passed">Lulus</SelectItem>
                    <SelectItem value="not_passed">Belum Lulus</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={kipFilter} onValueChange={(value: KipFilter) => setKipFilter(value)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status KIP" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua KIP</SelectItem>
                    <SelectItem value="yes">Penerima KIP</SelectItem>
                    <SelectItem value="no">Bukan Penerima</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex w-full max-w-lg items-center space-x-2">
              <Input
                type="text"
                placeholder="Cari nama siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">Gagal memuat data siswa. Silakan coba lagi nanti.</span>
          </div>
        )}

        {debouncedQuery && (
          <Card>
            <CardHeader>
              <CardTitle>Hasil Pencarian</CardTitle>
              <CardDescription>
                {filteredStudents.length} siswa ditemukan {statusFilter !== 'all' || kipFilter !== 'all' ? `(difilter dari ${totalStudents} total)` : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Nomer UTBK</TableHead>
                      <TableHead>Tanggal Lahir</TableHead>
                      <TableHead>PTN Tujuan</TableHead>
                      <TableHead>Program Studi</TableHead>
                      <TableHead>Status KIP</TableHead>
                      <TableHead>Status Kelulusan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      // Loading skeleton
                      Array(5).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-1/2" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-1/2" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-2/3" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-1/4" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-1/4" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredStudents.length > 0 ? (
                      // Actual data
                      filteredStudents.map((student, index) => (
                        <TableRow key={`${student.utbkNumber}-${index}`}>
                          <TableCell className="font-medium">{student.name || 'N/A'}</TableCell>
                          <TableCell className="font-mono">{student.utbkNumber || 'N/A'}</TableCell>
                          <TableCell>{student.dob || 'N/A'}</TableCell>
                          <TableCell>{student.ptn || 'Belum diterima'}</TableCell>
                          <TableCell>{student.prodi || 'Belum memilih'}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              student.kip 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {student.kip ? 'Ya' : 'Tidak'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              student.passed 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {student.passed ? 'Lulus' : 'Belum lulus'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Tidak ada data yang ditemukan
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
