import { FolderHeart, Sparkles, Camera, Film, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { TabButton } from './TabButton';

export function Navigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white shadow-lg flex justify-around items-center border-t border-gray-100">
      <NavLink to="/closet" className={({ isActive }) => isActive ? 'text-indigo-600' : 'text-gray-500'}>
        {({ isActive }) => (
          <TabButton
            icon={<FolderHeart size={20} />}
            label="Closet"
            active={isActive}
            onClick={() => {}}
          />
        )}
      </NavLink>
      <NavLink to="/styling" className={({ isActive }) => isActive ? 'text-indigo-600' : 'text-gray-500'}>
        {({ isActive }) => (
          <TabButton
            icon={<Sparkles size={20} />}
            label="AI Styling"
            active={isActive}
            onClick={() => {}}
          />
        )}
      </NavLink>
      <NavLink to="/tryon" className={({ isActive }) => isActive ? 'text-indigo-600' : 'text-gray-500'}>
        {({ isActive }) => (
          <TabButton
            icon={<Camera size={20} />}
            label="Try On"
            active={isActive}
            onClick={() => {}}
          />
        )}
      </NavLink>
      <NavLink to="/feed" className={({ isActive }) => isActive ? 'text-indigo-600' : 'text-gray-500'}>
        {({ isActive }) => (
          <TabButton
            icon={<Film size={20} />}
            label="Feed"
            active={isActive}
            onClick={() => {}}
          />
        )}
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? 'text-indigo-600' : 'text-gray-500'}>
        {({ isActive }) => (
          <TabButton
            icon={<User size={20} />}
            label="Me"
            active={isActive}
            onClick={() => {}}
          />
        )}
      </NavLink>
    </div>
  );
} 