
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { University } from "../types";
import { MapPin, Users, GraduationCap, Building2 } from "lucide-react";

interface UniversityCardProps {
  university: University;
  onClick: () => void;
}

const UniversityCard = ({ university, onClick }: UniversityCardProps) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group bg-white/90 backdrop-blur-sm border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col"
      onClick={onClick}
    >
      <CardContent className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* University Logo */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm group-hover:shadow-md transition-all duration-300 flex items-center justify-center">
              {university.logo ? (
                <img 
                  src={university.logo} 
                  alt={university.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.university-fallback');
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
              ) : null}
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-slate-300 group-hover:text-slate-400 transition-colors duration-300 hidden university-fallback" />
            </div>
            
            {university.isTopFive ? (
              <div className="absolute -top-1 -right-1 sm:top-0 sm:right-0">
                <Badge 
                  variant="secondary" 
                  className="bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0 shadow-sm text-[9px] sm:text-[10px] px-1.5 py-0.5"
                >
                  🏅 Top 5
                </Badge>
              </div>
            ) : <></>}
          </div>
          
          {/* University Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-xs sm:text-sm md:text-base text-slate-900 group-hover:text-slate-700 transition-colors duration-200 mb-0.5 sm:mb-1 line-clamp-2 leading-snug">
              {university.name}
            </h3>
            <div className="flex items-start gap-1.5 text-slate-500 mb-2 sm:mb-3">
              <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0 mt-0.5 text-slate-400" />
              <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2 leading-tight">
                {university.address}
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-emerald-50 group-hover:bg-emerald-50/80 transition-colors duration-200">
                <div className="p-1 sm:p-1.5 rounded-md bg-emerald-500 text-white flex-shrink-0">
                  <GraduationCap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wide font-medium">Lolos</div>
                  <div className="font-bold text-emerald-600 text-xs sm:text-sm truncate">
                    {formatNumber(university.passers)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-slate-50 group-hover:bg-slate-50/80 transition-colors duration-200">
                <div className="p-1 sm:p-1.5 rounded-md bg-slate-500 text-white flex-shrink-0">
                  <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-wide font-medium">KIP</div>
                  <div className="font-bold text-slate-600 text-[11px] sm:text-xs truncate">
                    {formatNumber(university.kipUsers)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-slate-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </Card>
  );
};

export default UniversityCard;
