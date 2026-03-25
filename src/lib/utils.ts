import { TrainingPeriod } from '@/types';
import { differenceInDays, isWithinInterval, parseISO } from 'date-fns';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getTrainingProgress(
  periods: TrainingPeriod[],
  currentDate: Date = new Date()
): { currentPeriod: TrainingPeriod | null; percentage: number; daysLeft: number; totalDays: number; daysPassed: number } {
  for (const period of periods) {
    const start = parseISO(period.startDate);
    const end = parseISO(period.endDate);
    if (isWithinInterval(currentDate, { start, end })) {
      const totalDays = differenceInDays(end, start);
      const daysPassed = differenceInDays(currentDate, start);
      const daysLeft = totalDays - daysPassed;
      const percentage = Math.round((daysPassed / totalDays) * 100);
      return { currentPeriod: period, percentage, daysLeft, totalDays, daysPassed };
    }
  }
  // Check upcoming periods
  const upcoming = periods.find((p) => parseISO(p.startDate) > currentDate);
  if (upcoming) {
    const daysLeft = differenceInDays(parseISO(upcoming.startDate), currentDate);
    return {
      currentPeriod: upcoming,
      percentage: 0,
      daysLeft,
      totalDays: differenceInDays(parseISO(upcoming.endDate), parseISO(upcoming.startDate)),
      daysPassed: 0,
    };
  }
  // All completed
  const last = periods[periods.length - 1];
  return {
    currentPeriod: last,
    percentage: 100,
    daysLeft: 0,
    totalDays: differenceInDays(parseISO(last.endDate), parseISO(last.startDate)),
    daysPassed: differenceInDays(parseISO(last.endDate), parseISO(last.startDate)),
  };
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
