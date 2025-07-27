import React from 'react';
import { Outlet } from 'react-router-dom';
import { Dock, DockItem, DockIcon, DockLabel } from './Dock';
import { User, PenTool, Heart, BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dockItems = [
    { path: '/about', icon: User, label: 'About' },
    { path: '/writing', icon: PenTool, label: 'Writing' },
    { path: '/dana', icon: Heart, label: 'Dana' },
    { path: '/resources', icon: BookOpen, label: 'Resources' },
  ];

  return (
    <div className="min-h-screen bg-white relative">
      <div className="pb-32">
        <Outlet />
      </div>
      
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <Dock>
          {dockItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <DockItem key={item.path}>
                <DockLabel>{item.label}</DockLabel>
                <DockIcon>
                  <div
                    onClick={() => navigate(item.path)}
                    className={`w-full h-full flex items-center justify-center cursor-pointer rounded-lg transition-colors ${
                      isActive ? 'bg-black text-white' : 'text-black hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                </DockIcon>
              </DockItem>
            );
          })}
        </Dock>
      </div>
    </div>
  );
};

export default Layout;