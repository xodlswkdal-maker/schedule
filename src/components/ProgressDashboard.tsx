'use client';

import { USERS } from '@/lib/data';
import { getTrainingProgress } from '@/lib/utils';
import { GraduationCap, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProgressDashboard() {
  const now = new Date();

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold px-1">수련 진척 현황</h2>

      {USERS.map((user) => {
        const { currentPeriod, percentage, daysLeft, totalDays, daysPassed } =
          getTrainingProgress(user.periods, now);
        const isBlue = user.color === 'blue';

        return (
          <div
            key={user.id}
            className="bg-[var(--bg-card)] rounded-2xl p-5 shadow-sm border border-gray-50 dark:border-gray-800"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm',
                  isBlue ? 'bg-blue-500' : 'bg-pink-500'
                )}
              >
                {user.name[0]}
              </div>
              <div>
                <h3 className="font-semibold text-sm">{user.name}</h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {currentPeriod?.role || user.role}
                  {currentPeriod && (
                    <span className="ml-1">
                      ({currentPeriod.startDate.slice(0, 7)} ~ {currentPeriod.endDate.slice(0, 7)})
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-[var(--text-secondary)]">진행률</span>
                <span className={cn('text-lg font-bold', isBlue ? 'text-blue-500' : 'text-pink-500')}>
                  {percentage}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-1000 ease-out',
                    isBlue
                      ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                      : 'bg-gradient-to-r from-pink-400 to-pink-600'
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <Clock className="w-4 h-4 mx-auto mb-1 text-[var(--text-secondary)]" />
                <p className="text-xs text-[var(--text-secondary)]">남은 일수</p>
                <p className="text-sm font-bold mt-0.5">D-{daysLeft}</p>
              </div>
              <div className="text-center p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <TrendingUp className="w-4 h-4 mx-auto mb-1 text-[var(--text-secondary)]" />
                <p className="text-xs text-[var(--text-secondary)]">경과</p>
                <p className="text-sm font-bold mt-0.5">{daysPassed}일</p>
              </div>
              <div className="text-center p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <GraduationCap className="w-4 h-4 mx-auto mb-1 text-[var(--text-secondary)]" />
                <p className="text-xs text-[var(--text-secondary)]">전체</p>
                <p className="text-sm font-bold mt-0.5">{totalDays}일</p>
              </div>
            </div>

            {/* Additional periods */}
            {user.periods.length > 1 && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <p className="text-[10px] text-[var(--text-secondary)] mb-2">전체 수련 과정</p>
                <div className="space-y-1.5">
                  {user.periods.map((period, idx) => {
                    const pInfo = getTrainingProgress([period], now);
                    const isCurrent = pInfo.percentage > 0 && pInfo.percentage < 100;
                    return (
                      <div
                        key={idx}
                        className={cn(
                          'flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg',
                          isCurrent
                            ? isBlue
                              ? 'bg-blue-50 dark:bg-blue-900/20'
                              : 'bg-pink-50 dark:bg-pink-900/20'
                            : ''
                        )}
                      >
                        <span className="font-medium">{period.role}</span>
                        <span className="text-[var(--text-secondary)]">
                          {period.startDate.slice(0, 7)} ~ {period.endDate.slice(0, 7)}
                        </span>
                        {isCurrent && (
                          <span className={cn('font-bold', isBlue ? 'text-blue-500' : 'text-pink-500')}>
                            진행중
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
