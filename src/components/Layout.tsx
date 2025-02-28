
import { ReactNode } from 'react';
import Navigation from './Navigation';
import { StudentProfile } from './StudentProfile';
import { useState, useEffect } from 'react';
import { studentData } from '../utils/mockData';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showProfile?: boolean;
  showBackButton?: boolean;
}

const Layout = ({ children, title, showProfile = true, showBackButton = false }: LayoutProps) => {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className={`sticky top-0 z-50 glass border-b transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="container max-w-4xl mx-auto flex justify-between items-center p-4">
          <div className="flex items-center">
            {showBackButton && (
              <button 
                onClick={handleBack}
                className="mr-2 p-1.5 rounded-full hover:bg-muted/50 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            {title && (
              <h1 className="text-xl font-medium font-display">{title}</h1>
            )}
          </div>
          {showProfile && <StudentProfile student={studentData} />}
        </div>
      </header>
      
      <main className="flex-1 container max-w-4xl mx-auto p-4 pb-20">
        <div className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {children}
        </div>
      </main>
      
      {!isHomePage && <Navigation />}
    </div>
  );
};

export default Layout;
