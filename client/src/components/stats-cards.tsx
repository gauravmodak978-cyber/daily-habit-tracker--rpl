import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Flame, Target, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  totalHabits: number;
  todayProgress: number;
  currentStreak: number;
  bestStreak: number;
}

export function StatsCards({ totalHabits, todayProgress, currentStreak, bestStreak }: StatsCardsProps) {
  const stats = [
    {
      label: "Total Habits",
      value: totalHabits,
      icon: Target,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      testId: "stat-total-habits",
    },
    {
      label: "Today's Progress",
      value: `${todayProgress}%`,
      icon: CheckCircle2,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      testId: "stat-today-progress",
    },
    {
      label: "Current Streak",
      value: currentStreak,
      icon: Flame,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      testId: "stat-current-streak",
    },
    {
      label: "Best Streak",
      value: bestStreak,
      icon: TrendingUp,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
      testId: "stat-best-streak",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={stat.label} 
          className="animate-in fade-in slide-in-from-top-4 duration-500"
          style={{ animationDelay: `${index * 100}ms` }}
          data-testid={`card-${stat.testId}`}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold font-mono" data-testid={stat.testId}>
                  {stat.value}
                </p>
              </div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-md ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
