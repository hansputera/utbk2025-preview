
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Program } from "../types";
import { GraduationCap, TrendingUp } from "lucide-react";

interface ProgramCardProps {
  program: Program;
  onClick: () => void;
}

const ProgramCard = ({ program, onClick }: ProgramCardProps) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group bg-white/90 backdrop-blur-sm border-0 shadow-md overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-100 to-slate-100 group-hover:from-violet-200 group-hover:to-slate-200 transition-all duration-300">
              <GraduationCap className="h-6 w-6 text-violet-600" />
            </div>
            
            <div className="flex-1">
              <h4 className="font-bold text-lg text-slate-900 group-hover:text-violet-600 transition-colors duration-300 mb-2">
                {program.name}
              </h4>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-slate-500">
                  <span className="font-bold text-emerald-600 text-lg">{formatNumber(program.passers)}</span> peserta yang lolos
                </span>
              </div>
            </div>
          </div>
          
          {program.isTopFive ? (
            <Badge variant="secondary" className="bg-gradient-to-r from-rose-400 to-pink-400 text-white border-0 shadow-lg animate-pulse">
              🔥 Top 5
            </Badge>
          ) : <></>}
        </div>
      </CardContent>
      
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-slate-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </Card>
  );
};

export default ProgramCard;
