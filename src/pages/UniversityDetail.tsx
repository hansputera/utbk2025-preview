
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProgramCard from "../components/ProgramCard";
import { apiService } from "../services/api";
import { ArrowLeft, MapPin, Users, GraduationCap, BookOpen } from "lucide-react";

const UniversityDetail = () => {
  const { id: ptnCode } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch university details
  const { data: universityResponse, isLoading: universityLoading } = useQuery({
    queryKey: ['university', ptnCode],
    queryFn: () => apiService.getUniversity(ptnCode!),
    enabled: !!ptnCode,
  });

  // Fetch programs for this university
  const { data: programsResponse, isLoading: programsLoading } = useQuery({
    queryKey: ['programs', ptnCode],
    queryFn: () => apiService.getPrograms(ptnCode!),
    enabled: !!ptnCode,
  });

  const university = universityResponse?.data;
  const programs = programsResponse?.data || [];
  const isLoading = universityLoading || programsLoading;

  const handleProgramClick = (programCode: string) => {
    navigate(`/university/${ptnCode}/program/${programCode}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-600 mx-auto mb-6"></div>
          <p className="text-slate-600 text-lg animate-pulse">Loading university details...</p>
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏫</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Universitas tidak ditemukan</h2>
          <Button onClick={() => navigate('/')} className="bg-slate-600 hover:bg-slate-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')} 
            className="mb-6 hover:bg-slate-50 border-slate-200 transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-8 animate-fade-in">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-gray-100 flex-shrink-0 shadow-xl">
                {university.logo ? (
                  <img 
                    src={university.logo} 
                    alt={university.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">🏫</div>
                )}
              </div>
              {university.isTopFive === 1 ? (
                <div className="absolute -top-2 -right-2">
                  <Badge variant="secondary" className="bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0 shadow-lg animate-pulse">
                    🏅 Top 5
                  </Badge>
                </div>
              ) : <></>}
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-gray-900 bg-clip-text text-transparent mb-3">
                {university.name}
              </h1>
              {university.location && (
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="h-5 w-5" />
                  <p className="text-lg">{university.location}, {university.country}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats and Map */}
          <div className="lg:col-span-1 space-y-6">
            {/* University Stats */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">University Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-600 text-white">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <span className="text-slate-600 font-medium">Total Peserta Yang Lolos</span>
                  </div>
                  <span className="font-bold text-emerald-600 text-xl">
                    {formatNumber(university.passers)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-600 text-white">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="text-slate-600 font-medium">Pemilik KIP</span>
                  </div>
                  <span className="font-bold text-slate-600 text-xl">
                    {formatNumber(university.kip)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-violet-50 hover:bg-violet-100 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-violet-600 text-white">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="text-slate-600 font-medium">Jumlah Prodi</span>
                  </div>
                  <span className="font-bold text-violet-600 text-xl">
                    {programs.length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">Lokasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-slate-100 to-gray-100 rounded-xl flex items-center justify-center shadow-inner">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📍</div>
                    <p className="text-slate-700 font-medium text-lg">{university.location || 'Location not available'}</p>
                    {university.latitude && university.longitude && (
                      <p className="text-sm text-slate-500 mt-2">
                        {university.latitude.toFixed(4)}, {university.longitude.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Programs */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-2xl font-bold text-slate-900">
                  <span>Daftar Prodi / Jurusan</span>
                  <Badge variant="outline" className="text-lg px-4 py-2 border-violet-200 text-violet-600">
                    {programs.length} jurusan
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {programs.map((program, index) => (
                    <div 
                      key={program.code}
                      className="animate-fade-in"
                      style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                    >
                      <ProgramCard
                        program={{
                          ...program,
                          id: program.code,
                          isTopFive: program.isTopFive
                        }}
                        onClick={() => handleProgramClick(program.code)}
                      />
                    </div>
                  ))}
                </div>

                {programs.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📚</div>
                    <p className="text-slate-500 text-lg">No programs available for this university.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetail;
