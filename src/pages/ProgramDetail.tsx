
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PassersTable from "../components/PassersTable";
import { apiService } from "../services/api";
import { ArrowLeft, GraduationCap } from "lucide-react";

const ProgramDetail = () => {
  const { id: ptnCode, programId: programCode } = useParams<{ id: string; programId: string }>();
  const navigate = useNavigate();

  // Fetch university details
  const { data: universityResponse, isLoading: universityLoading } = useQuery({
    queryKey: ['university', ptnCode],
    queryFn: () => apiService.getUniversity(ptnCode!),
    enabled: !!ptnCode,
  });

  // Fetch programs to get the specific program details
  const { data: programsResponse, isLoading: programsLoading } = useQuery({
    queryKey: ['programs', ptnCode],
    queryFn: () => apiService.getPrograms(ptnCode!),
    enabled: !!ptnCode,
  });

  const university = universityResponse?.data;
  const programs = programsResponse?.data || [];
  const program = programs.find(p => Number.parseInt(p.code) === Number.parseInt(programCode));
  const isLoading = universityLoading || programsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-600 mx-auto mb-6"></div>
          <p className="text-slate-600 text-lg animate-pulse">Loading program details...</p>
        </div>
      </div>
    );
  }

  if (!university || !program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Program Not Found</h2>
          <Button onClick={() => navigate('/')} className="bg-slate-900 hover:bg-slate-800 text-white">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-4 sm:mb-6 text-xs sm:text-sm text-slate-600">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-slate-900 transition-colors duration-200 text-left"
            >
              Dashboard
            </button>
            <span className="hidden sm:inline">→</span>
            <button 
              onClick={() => navigate(`/university/${ptnCode}`)}
              className="hover:text-slate-900 transition-colors duration-200 text-left line-clamp-1"
            >
              {university.name}
            </button>
            <span className="hidden sm:inline">→</span>
            <span className="text-slate-900 font-medium line-clamp-1">{program.name}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:gap-8 animate-fade-in">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0 shadow-lg">
                {university.logo ? (
                  <img 
                    src={university.logo} 
                    alt={university.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🏫</div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2 rounded-xl bg-slate-100">
                  <GraduationCap className="h-6 w-6 text-slate-700" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {program.name}
                </h1>
                {program.isTopFive ? (
                  <Badge variant="secondary" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-md">
                    ⭐ Top 5 (Prodi)
                  </Badge>
                ) : <></>}
              </div>
              <p className="text-lg text-slate-600">di {university.name}</p>
            </div>

            <div className="text-right bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl shadow-sm border border-emerald-100">
              <div className="text-sm text-slate-500 uppercase tracking-wide mb-1">Total Peserta Yang Lolos</div>
              <div className="text-3xl font-bold text-emerald-600">
                {formatNumber(program.passers)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-sm animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900">Daftar Peserta Yang Lolos</CardTitle>
          </CardHeader>
          <CardContent>
            <PassersTable 
              ptnCode={ptnCode!} 
              programCode={programCode!} 
              programName={program.name} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgramDetail;
