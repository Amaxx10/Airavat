import { ReactNode } from 'react';

interface TabButtonProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

export function TabButton({ icon, label, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center relative py-1 px-3 transition-all ${active ? 'text-indigo-600' : 'text-gray-500'}`}
    >
      {active && (
        <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-indigo-500 rounded-full" />
      )}
      {icon}
      <span className={`text-xs mt-1 ${active ? 'font-medium' : ''}`}>{label}</span>
    </button>
  );
} 