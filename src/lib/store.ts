'use client';

import { Schedule, Todo } from '@/types';

const SCHEDULE_KEY = 'medical-schedule';
const TODO_KEY = 'medical-todos';

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Schedule operations
export function getSchedules(): Schedule[] {
  return getFromStorage<Schedule[]>(SCHEDULE_KEY, []);
}

export function saveSchedule(schedule: Schedule): Schedule[] {
  const schedules = getSchedules();
  // Remove existing schedule for same user+date
  const filtered = schedules.filter(
    (s) => !(s.date === schedule.date && s.userId === schedule.userId)
  );
  // If same type exists, it's a toggle-off; otherwise add
  const existing = schedules.find(
    (s) => s.date === schedule.date && s.userId === schedule.userId && s.type === schedule.type
  );
  const updated = existing ? filtered : [...filtered, schedule];
  saveToStorage(SCHEDULE_KEY, updated);
  return updated;
}

export function deleteSchedule(date: string, userId: string): Schedule[] {
  const schedules = getSchedules().filter(
    (s) => !(s.date === date && s.userId === userId)
  );
  saveToStorage(SCHEDULE_KEY, schedules);
  return schedules;
}

// Todo operations
export function getTodos(): Todo[] {
  return getFromStorage<Todo[]>(TODO_KEY, []);
}

export function saveTodo(todo: Todo): Todo[] {
  const todos = getTodos();
  const idx = todos.findIndex((t) => t.id === todo.id);
  const updated = idx >= 0 ? todos.map((t) => (t.id === todo.id ? todo : t)) : [...todos, todo];
  saveToStorage(TODO_KEY, updated);
  return updated;
}

export function deleteTodo(id: string): Todo[] {
  const todos = getTodos().filter((t) => t.id !== id);
  saveToStorage(TODO_KEY, todos);
  return todos;
}

export function toggleTodo(id: string): Todo[] {
  const todos = getTodos().map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveToStorage(TODO_KEY, todos);
  return todos;
}

export function copyRecurringTodos(fromDate: string, toDate: string, userId: string): Todo[] {
  const todos = getTodos();
  const recurring = todos.filter(
    (t) => t.date === fromDate && t.isRecurring && t.userId === userId
  );
  const newTodos = recurring.map((t) => ({
    ...t,
    id: crypto.randomUUID(),
    date: toDate,
    completed: false,
  }));
  const updated = [...todos, ...newTodos];
  saveToStorage(TODO_KEY, updated);
  return updated;
}
