'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Sun, Moon, Stethoscope, X } from 'lucide-react';
import { Schedule, ScheduleType } from '@/types';
import { USERS } from '@/lib/data';
import { getSchedules, saveSchedule, deleteSchedule } from '@/lib/store';
import { cn, formatDate } from '@/lib/utils';

interface Props {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  activeUser: string;
}

const SCHEDULE_CONFIG: Record<ScheduleType, { label: string; icon: typeof Sun }> = {
  day: { label: 'Day', icon: Sun },
  off: { label: 'Off', icon: Moon },
  oncall: { label: '당직', icon: Stethoscope },
};

export default function CalendarView({ selectedDate, onSelectDate, activeUser }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    setSchedules(getSchedules());
  }, []);

  const handleSetSchedule = useCallback(
    (type: ScheduleType) => {
      const schedule: Schedule = {
        id: crypto.randomUUID(),
        date: selectedDate,
        type,
        userId: activeUser,
      };
      const updated = saveSchedule(schedule);
      setSchedules(updated);
    },
    [selectedDate, activeUser]
  );

  const handleDeleteSchedule = useCallback(() => {
    const updated = deleteSchedule(selectedDate, activeUser);
    setSchedules(updated);
  }, [selectedDate, activeUser]);

  const getScheduleForDate = (dateStr: string) => {
    return schedules.filter((s) => s.date === dateStr);
  };

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows: React.ReactNode[] = [];
    let day = calStart;

    while (day <= calEnd) {
      const week: React.ReactNode[] = [];
      for (let i = 0; i < 7; i++) {
        const d = day;
        const dateStr = formatDate(d);
        const daySchedules = getScheduleForDate(dateStr);
        const isSelected = dateStr === selectedDate;
        const inMonth = isSameMonth(d, currentMonth);
        const today = isToday(d);

        week.push(
          <button
            key={dateStr}
            onClick={() => {
              onSelectDate(dateStr);
              setShowDetail(true);
            }}
            className={cn(
              'relative flex flex-col items-center py-1.5 rounded-xl transition-all min-h-[52px]',
              !inMonth && 'opacity-30',
              isSelected && 'bg-gray-100 dark:bg-gray-800',
              today && !isSelected && 'ring-1 ring-blue-300'
            )}
          >
            <span
              className={cn(
                'text-xs font-medium',
                i === 0 && 'text-red-400',
                i === 6 && 'text-blue-400',
                isSelected && 'font-bold'
              )}
            >
              {format(d, 'd')}
            </span>
            <div className="flex gap-0.5 mt-0.5">
              {daySchedules.map((s) => {
                const user = USERS.find((u) => u.id === s.userId);
                const colorMap: Record<string, Record<ScheduleType, string>> = {
                  blue: { day: 'bg-blue-400', off: 'bg-blue-200', oncall: 'bg-blue-600' },
                  pink: { day: 'bg-pink-400', off: 'bg-pink-200', oncall: 'bg-pink-600' },
                };
                return (
                  <span
                    key={s.id}
                    className={cn(
                      'w-2 h-2 rounded-full',
                      colorMap[user?.color || 'blue'][s.type]
                    )}
                  />
                );
              })}
            </div>
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7 gap-0.5">
          {week}
        </div>
      );
    }
    return rows;
  };

  const selectedSchedules = getScheduleForDate(selectedDate);
  const activeUserSchedule = selectedSchedules.find((s) => s.userId === activeUser);

  return (
    <div className="space-y-3">
      {/* Month Navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-semibold">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-3 shadow-sm border border-gray-50 dark:border-gray-800">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
            <div
              key={d}
              className={cn(
                'text-center text-[10px] font-medium py-1',
                i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-[var(--text-secondary)]'
              )}
            >
              {d}
            </div>
          ))}
        </div>
        {renderDays()}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-[10px] text-[var(--text-secondary)]">
        {USERS.map((user) => (
          <div key={user.id} className="flex items-center gap-2">
            <span className="font-medium">{user.name}</span>
            <span className={cn('w-2 h-2 rounded-full', user.color === 'blue' ? 'bg-blue-400' : 'bg-pink-400')} />
            <span>Day</span>
            <span className={cn('w-2 h-2 rounded-full', user.color === 'blue' ? 'bg-blue-200' : 'bg-pink-200')} />
            <span>Off</span>
            <span className={cn('w-2 h-2 rounded-full', user.color === 'blue' ? 'bg-blue-600' : 'bg-pink-600')} />
            <span>당직</span>
          </div>
        ))}
      </div>

      {/* Selected Date Detail */}
      {showDetail && (
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 shadow-sm border border-gray-50 dark:border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              {format(new Date(selectedDate + 'T00:00:00'), 'M월 d일 (EEEE)', { locale: ko })}
            </h3>
            <button
              onClick={() => setShowDetail(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Both users' schedules for selected date */}
          <div className="space-y-2">
            {USERS.map((user) => {
              const userSchedule = selectedSchedules.find((s) => s.userId === user.id);
              return (
                <div key={user.id} className="flex items-center gap-2 text-sm">
                  <span
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white',
                      user.color === 'blue' ? 'bg-blue-500' : 'bg-pink-500'
                    )}
                  >
                    {user.name[0]}
                  </span>
                  <span className="font-medium">{user.name}</span>
                  {userSchedule ? (
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        userSchedule.type === 'day' &&
                          (user.color === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'),
                        userSchedule.type === 'off' &&
                          (user.color === 'blue' ? 'bg-blue-50 text-blue-500' : 'bg-pink-50 text-pink-500'),
                        userSchedule.type === 'oncall' &&
                          (user.color === 'blue' ? 'bg-blue-600 text-white' : 'bg-pink-600 text-white')
                      )}
                    >
                      {SCHEDULE_CONFIG[userSchedule.type].label}
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--text-secondary)]">일정 없음</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Schedule buttons for active user */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <p className="text-[10px] text-[var(--text-secondary)] mb-2">
              {USERS.find((u) => u.id === activeUser)?.name}의 일정 설정
            </p>
            <div className="flex gap-2">
              {(Object.entries(SCHEDULE_CONFIG) as [ScheduleType, typeof SCHEDULE_CONFIG['day']][]).map(
                ([type, config]) => {
                  const isActive = activeUserSchedule?.type === type;
                  const Icon = config.icon;
                  const userColor = USERS.find((u) => u.id === activeUser)?.color;
                  return (
                    <button
                      key={type}
                      onClick={() => handleSetSchedule(type)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all border',
                        isActive
                          ? userColor === 'blue'
                            ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                            : 'bg-pink-500 text-white border-pink-500 shadow-sm'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-[var(--text-secondary)]'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {config.label}
                    </button>
                  );
                }
              )}
              {activeUserSchedule && (
                <button
                  onClick={handleDeleteSchedule}
                  className="px-3 py-2.5 rounded-xl text-xs border border-red-200 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
