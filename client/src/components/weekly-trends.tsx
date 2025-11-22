import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface WeeklyTrendsProps {
  data: { day: string; percentage: number }[];
}

export function WeeklyTrends({ data }: WeeklyTrendsProps) {
  return (
    <Card data-testid="card-weekly-trends">
      <CardHeader>
        <CardTitle className="text-xl" data-testid="text-weekly-trends-title">Weekly Trends</CardTitle>
      </CardHeader>
      <CardContent data-testid="chart-weekly-trends">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis
              dataKey="day"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-md border bg-popover p-2 shadow-md">
                      <p className="text-sm font-medium">{payload[0].payload.day}</p>
                      <p className="text-sm text-muted-foreground">
                        {payload[0].value}% completed
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
