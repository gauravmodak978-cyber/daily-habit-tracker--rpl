import type { User, Habit, HabitCompletion } from "@shared/schema";

const STORAGE_KEYS = {
  USERS: "habit-tracker-users",
  CURRENT_USER: "habit-tracker-current-user",
  REMEMBER_ME: "habit-tracker-remember-me",
  HABITS: (userId: string) => `habit-tracker-habits-${userId}`,
  COMPLETIONS: (userId: string) => `habit-tracker-completions-${userId}`,
};

export const DEFAULT_USERS: User[] = [
  { id: "1", username: "alex", displayName: "Alex Chen", avatarColor: "hsl(142, 76%, 36%)", createdAt: new Date().toISOString() },
  { id: "2", username: "jordan", displayName: "Jordan Smith", avatarColor: "hsl(197, 71%, 40%)", createdAt: new Date().toISOString() },
  { id: "3", username: "sam", displayName: "Sam Taylor", avatarColor: "hsl(271, 81%, 42%)", createdAt: new Date().toISOString() },
  { id: "4", username: "riley", displayName: "Riley Morgan", avatarColor: "hsl(43, 96%, 45%)", createdAt: new Date().toISOString() },
  { id: "5", username: "casey", displayName: "Casey Parker", avatarColor: "hsl(27, 87%, 47%)", createdAt: new Date().toISOString() },
  { id: "6", username: "morgan", displayName: "Morgan Lee", avatarColor: "hsl(340, 75%, 42%)", createdAt: new Date().toISOString() },
  { id: "7", username: "drew", displayName: "Drew Anderson", avatarColor: "hsl(24, 95%, 53%)", createdAt: new Date().toISOString() },
  { id: "8", username: "quinn", displayName: "Quinn Davis", avatarColor: "hsl(262, 83%, 58%)", createdAt: new Date().toISOString() },
  { id: "9", username: "avery", displayName: "Avery Wilson", avatarColor: "hsl(173, 58%, 39%)", createdAt: new Date().toISOString() },
  { id: "10", username: "hayden", displayName: "Hayden Brown", avatarColor: "hsl(217, 91%, 60%)", createdAt: new Date().toISOString() },
];

export const storageHelpers = {
  initializeUsers() {
    const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!storedUsers) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser(user: User, rememberMe: boolean = true) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, "true");
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    }
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
  },

  getHabits(userId: string): Habit[] {
    const habitsStr = localStorage.getItem(STORAGE_KEYS.HABITS(userId));
    return habitsStr ? JSON.parse(habitsStr) : [];
  },

  saveHabits(userId: string, habits: Habit[]) {
    localStorage.setItem(STORAGE_KEYS.HABITS(userId), JSON.stringify(habits));
  },

  getCompletions(userId: string): HabitCompletion[] {
    const completionsStr = localStorage.getItem(STORAGE_KEYS.COMPLETIONS(userId));
    return completionsStr ? JSON.parse(completionsStr) : [];
  },

  saveCompletions(userId: string, completions: HabitCompletion[]) {
    localStorage.setItem(STORAGE_KEYS.COMPLETIONS(userId), JSON.stringify(completions));
  },

  exportUserData(userId: string) {
    return {
      habits: this.getHabits(userId),
      completions: this.getCompletions(userId),
      exportedAt: new Date().toISOString(),
    };
  },

  importUserData(userId: string, data: { habits: Habit[]; completions: HabitCompletion[] }) {
    this.saveHabits(userId, data.habits);
    this.saveCompletions(userId, data.completions);
  },

  clearUserData(userId: string) {
    localStorage.removeItem(STORAGE_KEYS.HABITS(userId));
    localStorage.removeItem(STORAGE_KEYS.COMPLETIONS(userId));
  },
};

export function calculateStreak(habitId: string, completions: HabitCompletion[]): number {
  let streak = 0;
  let currentDate = new Date();
  
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const completion = completions.find(
      c => c.habitId === habitId && c.date === dateStr && c.completed
    );
    
    if (!completion) break;
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
}

export function getWeeklyData(habitId: string, completions: HabitCompletion[]): boolean[] {
  const data: boolean[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const completed = completions.some(
      c => c.habitId === habitId && c.date === dateStr && c.completed
    );
    data.push(completed);
  }
  return data;
}

export function getHeatmapData(habits: Habit[], completions: HabitCompletion[]) {
  const data: { date: string; count: number; total: number }[] = [];
  const today = new Date();
  const activeHabits = habits.filter(h => !h.archived);
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayCompletions = completions.filter(c => c.date === dateStr && c.completed);
    
    data.push({
      date: dateStr,
      count: dayCompletions.length,
      total: activeHabits.length,
    });
  }
  
  return data;
}

export function getWeeklyTrends(habits: Habit[], completions: HabitCompletion[]) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const data: { day: string; percentage: number }[] = [];
  const activeHabits = habits.filter(h => !h.archived);
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = days[date.getDay()];
    
    const dayCompletions = completions.filter(c => c.date === dateStr && c.completed);
    const percentage = activeHabits.length > 0
      ? Math.round((dayCompletions.length / activeHabits.length) * 100)
      : 0;
    
    data.push({ day: dayName, percentage });
  }
  
  return data;
}
