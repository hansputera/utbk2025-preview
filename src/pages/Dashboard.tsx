
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import StatsCard from "../components/StatsCard";
import UniversityCard from "../components/UniversityCard";
import Pagination from "../components/Pagination";
import { apiService } from "../services/api";
import { Search, Filter } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("passers");
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 6;

  // Fetch stats
  const { data: statsResponse } = useQuery({
    queryKey: ['stats'],
    queryFn: () => apiService.getStats(),
  });

  // Fetch universities with pagination and search
  const { data: universitiesResponse, isLoading } = useQuery({
    queryKey: ['universities', currentPage, searchTerm, sortBy],
    queryFn: () => apiService.getUniversities(currentPage, itemsPerPage, searchTerm || undefined),
  });

  const stats = statsResponse?.data;
  const universities = universitiesResponse?.data || [];
  const meta = universitiesResponse?.meta;

  const handleUniversityClick = (universityCode: string) => {
    navigate(`/university/${universityCode}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Only show loading screen on initial load (no search term and first page)
  if (isLoading && !searchTerm && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-600 mx-auto mb-6"></div>
          <p className="text-slate-600 text-lg animate-pulse">Loading UTBK data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="animate-fade-in">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
                UTBK 2025 Previewer
              </h1>
              <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base md:text-lg">2025 Statistik UTBK</p>
            </div>
            <div className="text-right animate-fade-in">
              <div className="text-xs sm:text-sm text-slate-500">Last updated</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-900">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <StatsCard
                title="Total Peserta UTBK"
                value={stats.totalRegistrants}
                icon="👥"
                trend="Jumlah peserta UTBK yang terdaftar"
                color="bg-slate-600"
                className="h-full"
              />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <StatsCard
                title="Total Peserta Lolos"
                value={stats.totalPassers}
                icon="✅"
                trend="Jumlah peserta UTBK yang lolos"
                color="bg-emerald-600"
              />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <StatsCard
                title="Total Peserta Gagal"
                value={stats.totalFailures}
                icon="❌"
                trend="Jumlah peserta UTBK yang gagal"
                color="bg-rose-500"
              />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <StatsCard
                title="KIP/Bidik Misi"
                value={stats.kipParticipant}
                icon="🎓"
                trend="Jumlah peserta UTBK yang memiliki KIP"
                color="bg-violet-600"
              />
            </div>
          </div>
        )}

        {/* Universities Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-6 md:p-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div className="w-full sm:w-auto">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Universitas</h2>
              <p className="text-slate-600 text-sm sm:text-base">Universitas berdasarkan jumlah peserta yang lolos</p>
            </div>
            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Cari universitas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full text-sm sm:text-base h-10 sm:h-11"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full text-sm sm:text-base h-10 sm:h-11">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passers">Peserta Lolos</SelectItem>
                    <SelectItem value="name">Nama Universitas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading && (searchTerm || currentPage > 1) ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Mencari...</p>
            </div>
          ) : universities.length > 0 ? (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {universities.map((university, index) => (
                <div 
                  key={university.code} 
                  className="animate-fade-in h-full" 
                  style={{ animationDelay: `${0.1 * (index % 3)}s` }}
                >
                  <UniversityCard 
                    university={{
                      ...university,
                      id: university.code,
                      address: university.location?.concat(', ', university.country ?? '-') ?? '-',
                      kipUsers: university.kip || 0,
                      isTopFive: university.isTopFive,
                    }}
                    onClick={() => handleUniversityClick(university.code)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <Search className="h-12 w-12 mx-auto opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-1">Universitas tidak ditemukan</h3>
              <p className="text-slate-500 text-sm">Coba kata kunci lain atau hapus filter pencarian</p>
            </div>
          )}

          {/* Removed duplicate empty state since we're handling it above */}

          {/* Pagination */}
          {meta && meta.pages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={meta.pages}
              totalItems={meta.total}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
