
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
  trend?: string;
  color?: string;
  className?: string;
}

const StatsCard = ({ title, value, icon, trend, color = "bg-blue-500", className = "" }: StatsCardProps) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group cursor-pointer bg-white/90 backdrop-blur-sm border-0 shadow-lg h-full ${className}`}>
      <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500 ${color}`}></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
          {title}
        </CardTitle>
        <div className={`p-3 rounded-xl ${color} bg-opacity-15 group-hover:bg-opacity-25 transition-all duration-300 group-hover:scale-110`}>
          <span className="text-3xl filter drop-shadow-sm">{icon}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:scale-105 transition-transform duration-300">
          {formatNumber(value)}
        </div>
        {trend && (
          <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
            {trend}
          </p>
        )}
      </CardContent>
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
    </Card>
  );
};

export default StatsCard;
