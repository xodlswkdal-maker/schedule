'use client';

import { useState } from 'react';
import { Calendar, Heart, ListTodo, BarChart3 } from 'lucide-react';
import { USERS } from '@/lib/data';
import CalendarView from '@/components/CalendarView';
import ProgressDashboard from '@/components/ProgressDashboard';
import TodoList from '@/components/TodoList';
import { formatDate } from '@/lib/utils';

type Tab = 'calendar' | 'todo' | 'progress';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('calendar');
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [activeUser, setActiveUser] = useState(USERS[0].id);

  return (
    <div className="max-w-lg mx-auto min-h-screen flex flex-col bg-[var(--bg-warm)]">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              태인 <Heart className="w-4 h-4 text-pink-400 fill-pink-400" /> 소진
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">우리의 일정</p>
          </div>
          {/* User toggle */}
          <div className="flex bg-white/80 dark:bg-gray-800/80 rounded-full p-1 shadow-sm border border-gray-100 dark:border-gray-700">
            {USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => setActiveUser(user.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeUser === user.id
                    ? user.id === 'taein'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-pink-500 text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {user.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pb-24 overflow-y-auto">
        {activeTab === 'calendar' && (
          <CalendarView
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            activeUser={activeUser}
          />
        )}
        {activeTab === 'todo' && (
          <TodoList
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            activeUser={activeUser}
          />
        )}
        {activeTab === 'progress' && <ProgressDashboard />}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 z-50">
        <div className="max-w-lg mx-auto flex justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {[
            { id: 'calendar' as Tab, icon: Calendar, label: '캘린더' },
            { id: 'todo' as Tab, icon: ListTodo, label: '할 일' },
            { id: 'progress' as Tab, icon: BarChart3, label: '수련현황' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${
                activeTab === id
                  ? 'text-blue-500'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
