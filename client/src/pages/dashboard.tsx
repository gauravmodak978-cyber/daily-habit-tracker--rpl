import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, LogOut, ListTodo } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { StatsCards } from "@/components/stats-cards";
import { ContributionHeatmap } from "@/components/contribution-heatmap";
import { HabitCard } from "@/components/habit-card";
import { AddHabitModal } from "@/components/add-habit-modal";
import { TodaysSummary } from "@/components/todays-summary";
import { WeeklyTrends } from "@/components/weekly-trends";
import { useToast } from "@/hooks/use-toast";
import { storageHelpers, calculateStreak, getWeeklyData, getHeatmapData, getWeeklyTrends } from "@/lib/storage";
import type { User, Habit, HabitCompletion, InsertHabit } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    const user = storageHelpers.getCurrentUser();
    if (!user) {
      setLocation("/");
      return;
    }
    
    setCurrentUser(user);
    loadUserData(user.id);
  }, [setLocation]);

  const loadUserData = (userId: string) => {
    setHabits(storageHelpers.getHabits(userId));
    setCompletions(storageHelpers.getCompletions(userId));
  };

  const saveHabits = (newHabits: Habit[]) => {
    if (currentUser) {
      storageHelpers.saveHabits(currentUser.id, newHabits);
      setHabits(newHabits);
    }
  };

  const saveCompletions = (newCompletions: HabitCompletion[]) => {
    if (currentUser) {
      storageHelpers.saveCompletions(currentUser.id, newCompletions);
      setCompletions(newCompletions);
    }
  };

  const handleAddHabit = (data: InsertHabit) => {
    if (!currentUser) return;
    
    const newHabit: Habit = {
      ...data,
      id: Date.now().toString(),
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      archived: false,
    };
    
    saveHabits([...habits, newHabit]);
    toast({
      title: "Habit created",
      description: `"${data.name}" has been added to your habits.`,
    });
  };

  const handleEditHabit = (data: InsertHabit) => {
    if (!currentUser || !editingHabit) return;
    
    const updatedHabits = habits.map(h =>
      h.id === editingHabit.id ? { ...h, ...data } : h
    );
    
    saveHabits(updatedHabits);
    setEditingHabit(null);
    toast({
      title: "Habit updated",
      description: `"${data.name}" has been updated.`,
    });
  };

  const handleDeleteHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    const updatedHabits = habits.filter(h => h.id !== habitId);
    const updatedCompletions = completions.filter(c => c.habitId !== habitId);
    
    saveHabits(updatedHabits);
    saveCompletions(updatedCompletions);
    
    toast({
      title: "Habit deleted",
      description: `"${habit?.name}" has been removed.`,
      variant: "destructive",
    });
  };

  const handleToggleCompletion = (habitId: string) => {
    if (!currentUser) return;
    
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = completions.findIndex(
      c => c.habitId === habitId && c.date === today
    );
    
    let newCompletions: HabitCompletion[];
    
    if (existingIndex >= 0) {
      const existing = completions[existingIndex];
      newCompletions = [
        ...completions.slice(0, existingIndex),
        { ...existing, completed: !existing.completed },
        ...completions.slice(existingIndex + 1),
      ];
    } else {
      const newCompletion: HabitCompletion = {
        id: Date.now().toString(),
        habitId,
        userId: currentUser.id,
        date: today,
        completed: true,
      };
      newCompletions = [...completions, newCompletion];
    }
    
    saveCompletions(newCompletions);
  };

  const handleLogout = () => {
    storageHelpers.logout();
    setLocation("/");
  };

  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setIsAddModalOpen(true);
  };

  const activeHabits = habits.filter(h => !h.archived);
  const today = new Date().toISOString().split('T')[0];
  const todayCompletions = new Set(
    completions
      .filter(c => c.date === today && c.completed)
      .map(c => c.habitId)
  );

  const calculateBestStreak = (): number => {
    const streaks = activeHabits.map(h => calculateStreak(h.id, completions));
    return streaks.length > 0 ? Math.max(...streaks) : 0;
  };

  const todayProgress = activeHabits.length > 0
    ? Math.round((todayCompletions.size / activeHabits.length) * 100)
    : 0;

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-300">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-in slide-in-from-top duration-500">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
              <ListTodo className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-xl font-semibold">Habit Tracker</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsAddModalOpen(true)} data-testid="button-add-habit">
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-user-menu">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback 
                      style={{ backgroundColor: currentUser.avatarColor }}
                      className="text-primary-foreground"
                    >
                      {currentUser.displayName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback 
                      style={{ backgroundColor: currentUser.avatarColor }}
                      className="text-primary-foreground"
                    >
                      {currentUser.displayName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium" data-testid="text-user-display-name">{currentUser.displayName}</p>
                    <p className="text-xs text-muted-foreground" data-testid="text-user-username">@{currentUser.username}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <StatsCards
              totalHabits={activeHabits.length}
              todayProgress={todayProgress}
              currentStreak={calculateBestStreak()}
              bestStreak={calculateBestStreak()}
            />
            
            <ContributionHeatmap data={getHeatmapData(habits, completions)} />
            
            <div>
              <h2 className="text-2xl font-semibold mb-6">Active Habits</h2>
              {activeHabits.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center w-16 h-16 rounded-md bg-muted mx-auto mb-4">
                    <ListTodo className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No habits yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start building better habits by creating your first one.
                  </p>
                  <Button onClick={() => setIsAddModalOpen(true)} data-testid="button-create-first-habit">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Habit
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="habit-list">
                  {activeHabits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      completed={todayCompletions.has(habit.id)}
                      streak={calculateStreak(habit.id, completions)}
                      weeklyData={getWeeklyData(habit.id, completions)}
                      onToggle={handleToggleCompletion}
                      onEdit={openEditModal}
                      onDelete={handleDeleteHabit}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <TodaysSummary
              habits={activeHabits}
              completedHabits={todayCompletions}
              onToggle={handleToggleCompletion}
            />
            
            <WeeklyTrends data={getWeeklyTrends(habits, completions)} />
          </div>
        </div>
      </main>

      <AddHabitModal
        open={isAddModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if (!open) setEditingHabit(null);
        }}
        onSubmit={editingHabit ? handleEditHabit : handleAddHabit}
        editingHabit={editingHabit}
      />
    </div>
  );
}
