
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
      className="cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group bg-white/90 backdrop-blur-sm border-0 shadow-md overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-gray-100 flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center">
              {university.logo ? (
                <img 
                  src={university.logo} 
                  alt={university.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <Building2 className="h-8 w-8 text-slate-400 group-hover:text-slate-600 transition-colors duration-300" />
              )}
            </div>
            {university.isTopFive ? (
              <div className="absolute -top-2 -right-2 animate-pulse">
                <Badge variant="secondary" className="bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0 shadow-lg text-xs px-2 py-1">
                  🏅 Top 5
                </Badge>
              </div>
            ) : <></>}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-slate-900 group-hover:text-slate-700 transition-colors duration-300 mb-2">
                  {university.name}
                </h3>
                <div className="flex items-center gap-2 text-slate-500 mb-4">
                  <MapPin className="h-4 w-4" />
                  <p className="text-sm">{university.address}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 transition-colors duration-300">
                <div className="p-2 rounded-lg bg-emerald-600 text-white">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Peserta Lolos</div>
                  <div className="font-bold text-emerald-600 text-lg">{formatNumber(university.passers)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 group-hover:bg-slate-100 transition-colors duration-300">
                <div className="p-2 rounded-lg bg-slate-600 text-white">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Pemilik KIP</div>
                  <div className="font-bold text-slate-600 text-lg">{formatNumber(university.kipUsers)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 to-gray-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </Card>
  );
};

export default UniversityCard;
