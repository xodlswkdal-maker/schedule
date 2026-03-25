export type ScheduleType = 'day' | 'off' | 'oncall';

export type UserRole = '인턴' | '레지던트';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  periods: TrainingPeriod[];
  color: string;
}

export interface TrainingPeriod {
  role: UserRole;
  startDate: string; // YYYY-MM-DD
  endDate: string;
}

export interface Schedule {
  id: string;
  date: string; // YYYY-MM-DD
  type: ScheduleType;
  userId: string;
}

export interface Todo {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  completed: boolean;
  isRecurring: boolean;
  userId: string;
}
