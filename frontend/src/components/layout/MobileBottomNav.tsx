/**
 * MobileBottomNav - Mobile navigation bar at the bottom
 */

import { Users, Clock, Calendar, LucideIcon } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{ id: string; label: string; icon: LucideIcon }>;
}

export function MobileBottomNav({ activeTab, onTabChange, tabs }: MobileBottomNavProps) {
  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E0EA] z-40" 
      style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.06)' }}
    >
      <div className="flex items-center justify-around px-2 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all"
              style={{
                color: activeTab === tab.id ? '#2AB7CA' : '#6E6A7C',
              }}
            >
              <Icon className="w-5 h-5" />
              <span style={{ fontSize: '11px', fontWeight: 500 }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
