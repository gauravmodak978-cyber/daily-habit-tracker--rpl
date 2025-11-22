import { z } from "zod";

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarColor: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: string;
  archived: boolean;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  date: string;
  completed: boolean;
}

export interface DailyStats {
  date: string;
  completedCount: number;
  totalHabits: number;
}

export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(1),
  displayName: z.string().min(1),
  avatarColor: z.string(),
  createdAt: z.string(),
});

export const habitSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1, "Habit name is required").max(50, "Habit name too long"),
  color: z.string(),
  createdAt: z.string(),
  archived: z.boolean().default(false),
});

export const insertHabitSchema = habitSchema.omit({ id: true, createdAt: true, userId: true, archived: true });

export type InsertHabit = z.infer<typeof insertHabitSchema>;

export const completionSchema = z.object({
  id: z.string(),
  habitId: z.string(),
  userId: z.string(),
  date: z.string(),
  completed: z.boolean(),
});

export type User = z.infer<typeof userSchema>;
export type Habit = z.infer<typeof habitSchema>;
export type HabitCompletion = z.infer<typeof completionSchema>;
