import { cn } from "../../lib/utils";
import { TrendingUp, Gem, DollarSign, History } from "lucide-react"; // Import lucide-react icons

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: string; // This will now be a key for the iconMap
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const iconMap: { [key: string]: React.ElementType } = {
  '📈': TrendingUp,
  '🪙': Gem,
  '💰': DollarSign,
  '🔄': History,
};

export function MetricCard({ title, value, subtitle, icon, trend }: MetricCardProps) {
  const IconComponent = icon ? iconMap[icon] : null;

  return (
    <div className="border-t-4 border-bitgold-gold">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {IconComponent && <IconComponent size={20} className="text-white" />} {/* Render Icon Component */}
            <h4 className="text-sm text-darkGray uppercase tracking-wide">{title}</h4>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{value}</div>
          {subtitle && <div className="text-darkGray">{subtitle}</div>}
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded text-sm font-medium",
            trend.isPositive 
              ? "bg-[#4ADE80]/20 text-[#4ADE80]" 
              : "bg-red-500/20 text-red-400"
          )}>
            <span>{trend.isPositive ? "↗" : "↘"}</span>
            <span>{Math.abs(trend.value).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
