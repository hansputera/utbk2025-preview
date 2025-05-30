
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
                UTBK 2025 Previewer
              </h1>
              <p className="text-slate-600 mt-2 text-lg">2025 Statistik UTBK</p>
            </div>
            <div className="text-right animate-fade-in">
              <div className="text-sm text-slate-500">Last updated</div>
              <div className="text-sm font-semibold text-slate-900">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <StatsCard
                title="Total Peserta UTBK"
                value={stats.totalRegistrants}
                icon="👥"
                trend="Jumlah peserta UTBK yang terdaftar"
                color="bg-slate-600"
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
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Universitas</h2>
              <p className="text-slate-600 text-lg">Universitas berdasarkan jumlah peserta yang lolos</p>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Cari universitas..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-64 pl-10 border-slate-200 focus:border-slate-500 focus:ring-slate-500 transition-all duration-200"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 pl-10 border-slate-200 focus:border-slate-500 focus:ring-slate-500 transition-all duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passers">Sort by Jumlah Lolos</SelectItem>
                    <SelectItem value="name">Sort by Nama</SelectItem>
                    <SelectItem value="kip">Sort by pemilik KIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading && (searchTerm || currentPage > 1) && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Searching...</p>
            </div>
          )}

          <div className="grid gap-6">
            {universities.map((university, index) => (
              <div 
                key={university.code} 
                className="animate-fade-in"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <UniversityCard
                  university={{
                    ...university,
                    id: university.code,
                    address: university.location?.concat(', ', university.country ?? '-') ?? '-',
                    kipUsers: university.kip || 0, // Fix NaN by using kip from API and defaulting to 0
                    isTopFive: university.isTopFive,
                  }}
                  onClick={() => handleUniversityClick(university.code)}
                />
              </div>
            ))}
          </div>

          {universities.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-slate-500 text-lg">No universities found matching your search.</p>
            </div>
          )}

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
