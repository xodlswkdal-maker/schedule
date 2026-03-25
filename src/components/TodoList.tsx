'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Plus,
  Check,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Repeat,
  Copy,
} from 'lucide-react';
import { Todo } from '@/types';
import { USERS } from '@/lib/data';
import { getTodos, saveTodo, deleteTodo, toggleTodo, copyRecurringTodos } from '@/lib/store';
import { cn, formatDate } from '@/lib/utils';

interface Props {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  activeUser: string;
}

export default function TodoList({ selectedDate, onSelectDate, activeUser }: Props) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  useEffect(() => {
    setTodos(getTodos());
  }, []);

  const dateTodos = todos.filter((t) => t.date === selectedDate && t.userId === activeUser);
  const completedCount = dateTodos.filter((t) => t.completed).length;
  const user = USERS.find((u) => u.id === activeUser);

  const handleAddTodo = useCallback(() => {
    if (!newTodoText.trim()) return;
    const todo: Todo = {
      id: crypto.randomUUID(),
      date: selectedDate,
      content: newTodoText.trim(),
      completed: false,
      isRecurring,
      userId: activeUser,
    };
    const updated = saveTodo(todo);
    setTodos(updated);
    setNewTodoText('');
  }, [newTodoText, selectedDate, isRecurring, activeUser]);

  const handleToggle = useCallback((id: string) => {
    const updated = toggleTodo(id);
    setTodos(updated);
  }, []);

  const handleDelete = useCallback((id: string) => {
    const updated = deleteTodo(id);
    setTodos(updated);
  }, []);

  const handleCopyRecurring = useCallback(() => {
    const yesterday = formatDate(subDays(new Date(selectedDate + 'T00:00:00'), 1));
    const updated = copyRecurringTodos(yesterday, selectedDate, activeUser);
    setTodos(updated);
  }, [selectedDate, activeUser]);

  const goDate = (dir: number) => {
    const d = dir > 0
      ? addDays(new Date(selectedDate + 'T00:00:00'), 1)
      : subDays(new Date(selectedDate + 'T00:00:00'), 1);
    onSelectDate(formatDate(d));
  };

  return (
    <div className="space-y-3">
      {/* Date navigation */}
      <div className="flex items-center justify-between px-1">
        <button onClick={() => goDate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-semibold">
          {format(new Date(selectedDate + 'T00:00:00'), 'M월 d일 (EEE)', { locale: ko })}
        </h2>
        <button onClick={() => goDate(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-4 shadow-sm border border-gray-50 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold',
                user?.color === 'blue' ? 'bg-blue-500' : 'bg-pink-500'
              )}
            >
              {user?.name[0]}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}의 할 일</p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                {completedCount}/{dateTodos.length} 완료
              </p>
            </div>
          </div>
          <button
            onClick={handleCopyRecurring}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium bg-gray-50 dark:bg-gray-800 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Copy className="w-3 h-3" />
            전날 반복 복사
          </button>
        </div>

        {/* Progress mini bar */}
        {dateTodos.length > 0 && (
          <div className="mt-3 w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                user?.color === 'blue' ? 'bg-blue-500' : 'bg-pink-500'
              )}
              style={{ width: `${(completedCount / dateTodos.length) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Add todo */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-3 shadow-sm border border-gray-50 dark:border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="할 일 추가..."
            className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
          />
          <button
            onClick={handleAddTodo}
            disabled={!newTodoText.trim()}
            className={cn(
              'p-2.5 rounded-xl text-white transition-all disabled:opacity-30',
              user?.color === 'blue' ? 'bg-blue-500' : 'bg-pink-500'
            )}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => setIsRecurring(!isRecurring)}
          className={cn(
            'flex items-center gap-1 mt-2 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors',
            isRecurring
              ? user?.color === 'blue'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'
              : 'text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-gray-800'
          )}
        >
          <Repeat className="w-3 h-3" />
          매일 반복
        </button>
      </div>

      {/* Todo items */}
      <div className="space-y-2">
        {dateTodos.length === 0 && (
          <div className="text-center py-10 text-sm text-[var(--text-secondary)]">
            아직 할 일이 없어요
          </div>
        )}
        {dateTodos.map((todo) => (
          <div
            key={todo.id}
            className="bg-[var(--bg-card)] rounded-xl p-3.5 shadow-sm border border-gray-50 dark:border-gray-800 flex items-center gap-3"
          >
            <button
              onClick={() => handleToggle(todo.id)}
              className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                todo.completed
                  ? user?.color === 'blue'
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-pink-500 border-pink-500'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              )}
            >
              {todo.completed && <Check className="w-3 h-3 text-white" />}
            </button>
            <span
              className={cn(
                'flex-1 text-sm',
                todo.completed && 'line-through text-[var(--text-secondary)]'
              )}
            >
              {todo.content}
            </span>
            {todo.isRecurring && (
              <Repeat className="w-3 h-3 text-[var(--text-secondary)] shrink-0" />
            )}
            <button
              onClick={() => handleDelete(todo.id)}
              className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-[var(--text-secondary)] hover:text-red-400 transition-colors shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
