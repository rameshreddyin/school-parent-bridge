
import { ReactNode } from 'react';
import Navigation from './Navigation';
import { StudentProfile } from './StudentProfile';
import { useState, useEffect } from 'react';
import { studentData } from '../utils/mockData';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showProfile?: boolean;
}

const Layout = ({ children, title, showProfile = true }: LayoutProps) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className={`sticky top-0 z-50 glass border-b p-4 transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="container max-w-4xl mx-auto flex justify-between items-center">
          {title && (
            <h1 className="text-xl font-medium font-display">{title}</h1>
          )}
          {showProfile && <StudentProfile student={studentData} />}
        </div>
      </header>
      
      <main className="flex-1 container max-w-4xl mx-auto p-4 pb-20">
        <div className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {children}
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Layout;
