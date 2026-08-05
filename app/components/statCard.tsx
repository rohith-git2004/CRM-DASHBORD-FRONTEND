import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  percentage: string;
  positive?: boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  percentage,
  positive = true,
}: StatCardProps) {
  return (
    <div className="bg-[#1F2937] border border-[#374151] rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-400">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {value}
          </h2>

          <div className="flex items-center gap-1 mt-4">

            {positive ? (
              <TrendingUp size={16} className="text-green-500" />
            ) : (
              <TrendingDown size={16} className="text-red-500" />
            )}

            <span
              className={`text-sm font-medium ${
                positive ? "text-green-500" : "text-red-500"
              }`}
            >
              {percentage}
            </span>

            <span className="text-sm text-gray-400">
              this week
            </span>

          </div>

        </div>

        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: iconBg,
          }}
        >
          <Icon
            size={28}
            style={{
              color: iconColor,
            }}
          />
        </div>

      </div>

    </div>
  );
}