
import { Student } from '../utils/mockData';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface StudentProfileProps {
  student: Student;
}

export const StudentProfile = ({ student }: StudentProfileProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)} 
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 card-shadow">
          <img 
            src={student.profileImage} 
            alt={student.name} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="hidden sm:flex items-center">
          <span className="font-medium">{student.name}</span>
          <ChevronDown size={16} className="ml-1 text-muted-foreground" />
        </div>
      </button>

      {isMenuOpen && (
        <div 
          className="absolute right-0 top-12 w-60 glass rounded-xl border card-shadow p-3 z-50 animate-scale-in"
        >
          <div className="flex items-center space-x-3 mb-3 pb-3 border-b">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20">
              <img 
                src={student.profileImage} 
                alt={student.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">{student.name}</h3>
              <p className="text-sm text-muted-foreground">Class {student.grade}-{student.section}</p>
              <p className="text-xs text-muted-foreground">Roll No: {student.rollNumber}</p>
            </div>
          </div>
          
          <ul className="space-y-1">
            <li>
              <button className="w-full text-left p-2 rounded-lg text-sm hover:bg-muted/50 transition-colors">
                View Profile
              </button>
            </li>
            <li>
              <button className="w-full text-left p-2 rounded-lg text-sm hover:bg-muted/50 transition-colors">
                Settings
              </button>
            </li>
            <li>
              <button className="w-full text-left p-2 rounded-lg text-sm hover:bg-muted/50 transition-colors text-destructive">
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
      
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};
