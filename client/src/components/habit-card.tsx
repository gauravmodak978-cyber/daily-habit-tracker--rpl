import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2, Flame } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Habit } from "@shared/schema";

interface HabitCardProps {
  habit: Habit;
  completed: boolean;
  streak: number;
  weeklyData: boolean[];
  onToggle: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export function HabitCard({ habit, completed, streak, weeklyData, onToggle, onEdit, onDelete }: HabitCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="hover-elevate transition-all animate-in fade-in slide-in-from-bottom-2 duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex items-start gap-3 flex-1">
          <Checkbox
            checked={completed}
            onCheckedChange={() => onToggle(habit.id)}
            className="mt-0.5 h-5 w-5"
            data-testid={`checkbox-habit-${habit.id}`}
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-medium break-words" data-testid={`text-habit-name-${habit.id}`}>
              {habit.name}
            </h4>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              data-testid={`button-habit-menu-${habit.id}`}
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(habit)} data-testid={`button-edit-habit-${habit.id}`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(habit.id)}
              className="text-destructive"
              data-testid={`button-delete-habit-${habit.id}`}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1" data-testid={`weekly-data-${habit.id}`}>
            {weeklyData.map((day, index) => (
              <div
                key={index}
                className={`w-6 h-12 rounded-sm ${
                  day ? 'bg-chart-1' : 'bg-muted/30'
                }`}
                title={`Day ${index + 1}`}
                data-testid={`weekly-bar-${habit.id}-${index}`}
              />
            ))}
          </div>
        </div>
        
        {streak > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Flame className="w-4 h-4 text-chart-4" />
            <span className="font-medium font-mono" data-testid={`text-streak-${habit.id}`}>
              {streak} day streak
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
