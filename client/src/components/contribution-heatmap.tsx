import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HeatmapData {
  date: string;
  count: number;
  total: number;
}

interface ContributionHeatmapProps {
  data: HeatmapData[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function ContributionHeatmap({ data }: ContributionHeatmapProps) {
  const { weeks, monthSpans } = useMemo(() => {
    const today = new Date();
    const yearAgo = new Date(today);
    yearAgo.setDate(today.getDate() - 364);
    
    const startDayOfWeek = (yearAgo.getDay() + 6) % 7;
    const startDate = new Date(yearAgo);
    startDate.setDate(yearAgo.getDate() - startDayOfWeek);
    
    const dataMap = new Map(data.map(d => [d.date, d]));
    const weeks: HeatmapData[][] = [];
    const monthSpans: { month: string; span: number }[] = [];
    
    let currentDate = new Date(startDate);
    let lastMonth = -1;
    let currentMonthWeeks = 0;
    
    while (currentDate <= today) {
      const weekData: HeatmapData[] = [];
      let firstInRangeDate: Date | null = null;
      
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        if (currentDate >= yearAgo && currentDate <= today) {
          const cellData = dataMap.get(dateStr) || { date: dateStr, count: 0, total: 0 };
          weekData.push(cellData);
          if (!firstInRangeDate) {
            firstInRangeDate = new Date(currentDate);
          }
        } else {
          weekData.push({ date: "", count: 0, total: 0 });
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      if (weekData.some(cell => cell.date) && firstInRangeDate) {
        const month = firstInRangeDate.getMonth();
        if (month !== lastMonth) {
          if (lastMonth !== -1 && currentMonthWeeks > 0) {
            monthSpans.push({ month: MONTHS[lastMonth], span: currentMonthWeeks });
          }
          lastMonth = month;
          currentMonthWeeks = 1;
        } else {
          currentMonthWeeks++;
        }
        weeks.push(weekData);
      }
    }
    
    if (lastMonth !== -1 && currentMonthWeeks > 0) {
      monthSpans.push({ month: MONTHS[lastMonth], span: currentMonthWeeks });
    }
    
    return { weeks, monthSpans };
  }, [data]);

  const getIntensityClass = (count: number, total: number) => {
    if (total === 0) return "bg-muted/30 dark:bg-muted/20";
    const percentage = (count / total) * 100;
    if (percentage === 0) return "bg-muted/30 dark:bg-muted/20";
    if (percentage < 25) return "bg-chart-1/20 dark:bg-chart-1/25";
    if (percentage < 50) return "bg-chart-1/40 dark:bg-chart-1/45";
    if (percentage < 75) return "bg-chart-1/60 dark:bg-chart-1/65";
    if (percentage < 100) return "bg-chart-1/80 dark:bg-chart-1/85";
    return "bg-chart-1 dark:bg-chart-1";
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-1" data-testid="text-heatmap-title">Contribution Activity</h3>
          <p className="text-sm text-muted-foreground">Daily habit completion over the past year</p>
        </div>
        
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="space-y-2">
              <div className="grid gap-1" style={{ gridTemplateColumns: `32px repeat(${weeks.length}, 12px)` }}>
                <div />
                {monthSpans.map((monthSpan, index) => (
                  <div 
                    key={index} 
                    className="text-xs text-muted-foreground h-4"
                    style={{ gridColumn: `span ${monthSpan.span}` }}
                  >
                    {monthSpan.month}
                  </div>
                ))}
              </div>
              
              <div className="grid gap-1" style={{ gridTemplateColumns: `32px repeat(${weeks.length}, 12px)`, gridAutoFlow: 'column' }}>
                <div className="flex flex-col justify-around text-xs text-muted-foreground h-[90px]">
                  <div>Mon</div>
                  <div>Wed</div>
                  <div>Fri</div>
                </div>
                
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((cell, dayIndex) => {
                      if (!cell.date) {
                        return <div key={dayIndex} className="w-3 h-3" />;
                      }
                      
                      return (
                        <TooltipProvider key={dayIndex} delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`w-3 h-3 rounded-sm transition-colors cursor-pointer hover-elevate ${getIntensityClass(cell.count, cell.total)}`}
                                data-testid={`heatmap-cell-${cell.date}`}
                              />
                            </TooltipTrigger>
                            <TooltipContent className="bg-popover border-popover-border text-popover-foreground">
                              <div className="text-xs">
                                <p className="font-medium">{formatDate(cell.date)}</p>
                                <p className="text-muted-foreground">
                                  {cell.count} of {cell.total} habits completed
                                  {cell.total > 0 && ` (${Math.round((cell.count / cell.total) * 100)}%)`}
                                </p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-muted/30 dark:bg-muted/20" title="0%" />
                  <div className="w-3 h-3 rounded-sm bg-chart-1/20 dark:bg-chart-1/25" title="1-24%" />
                  <div className="w-3 h-3 rounded-sm bg-chart-1/40 dark:bg-chart-1/45" title="25-49%" />
                  <div className="w-3 h-3 rounded-sm bg-chart-1/60 dark:bg-chart-1/65" title="50-74%" />
                  <div className="w-3 h-3 rounded-sm bg-chart-1/80 dark:bg-chart-1/85" title="75-99%" />
                  <div className="w-3 h-3 rounded-sm bg-chart-1 dark:bg-chart-1" title="100%" />
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
