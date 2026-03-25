import { User } from '@/types';

export const USERS: User[] = [
  {
    id: 'taein',
    name: '태인',
    role: '인턴',
    periods: [
      { role: '인턴', startDate: '2026-03-01', endDate: '2027-02-28' },
    ],
    color: 'blue',
  },
  {
    id: 'sojin',
    name: '소진',
    role: '인턴',
    periods: [
      { role: '인턴', startDate: '2025-09-01', endDate: '2026-08-31' },
      { role: '레지던트', startDate: '2026-09-01', endDate: '2027-08-31' },
    ],
    color: 'pink',
  },
];

export function getUserById(id: string): User | undefined {
  return USERS.find((u) => u.id === id);
}
