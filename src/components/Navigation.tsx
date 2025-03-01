
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Calendar, 
  MessageSquare, 
  Wallet 
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  
  useState(() => {
    setMounted(true);
  });

  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: GraduationCap, label: 'Academics', path: '/academics' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Wallet, label: 'Fees', path: '/fees' },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t transition-all duration-500 ${mounted ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`relative p-1.5 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-muted/50'
                }`}>
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-1 h-1 bg-primary rounded-full scale-x-30 transition-transform duration-300"></span>
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium transition-all duration-200 ${
                  isActive ? 'opacity-100' : 'opacity-70'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
