import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import type { Habit } from "@shared/schema";

interface TodaysSummaryProps {
  habits: Habit[];
  completedHabits: Set<string>;
  onToggle: (habitId: string) => void;
}

export function TodaysSummary({ habits, completedHabits, onToggle }: TodaysSummaryProps) {
  const activeHabits = habits.filter(h => !h.archived);
  const completedCount = activeHabits.filter(h => completedHabits.has(h.id)).length;
  const percentage = activeHabits.length > 0 ? (completedCount / activeHabits.length) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Today's Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/30"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className="text-chart-1 transition-all duration-500"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-mono" data-testid="text-today-percentage">
                {Math.round(percentage)}%
              </span>
              <span className="text-xs text-muted-foreground">Complete</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {completedCount} of {activeHabits.length} habits
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          {activeHabits.slice(0, 5).map((habit) => (
            <div key={habit.id} className="flex items-center gap-3">
              <Checkbox
                checked={completedHabits.has(habit.id)}
                onCheckedChange={() => onToggle(habit.id)}
                className="h-4 w-4"
                data-testid={`checkbox-summary-habit-${habit.id}`}
              />
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0 opacity-80 dark:opacity-90"
                style={{ backgroundColor: habit.color }}
              />
              <span className="text-sm flex-1 truncate" data-testid={`text-summary-habit-name-${habit.id}`}>{habit.name}</span>
            </div>
          ))}
          {activeHabits.length > 5 && (
            <p className="text-xs text-muted-foreground text-center">
              +{activeHabits.length - 5} more habits
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
