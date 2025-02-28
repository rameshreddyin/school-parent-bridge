
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { studentData } from '../utils/mockData';
import { 
  GraduationCap, 
  CalendarDays, 
  FileText, 
  MessageSquare, 
  CreditCard, 
  LineChart, 
  Book, 
  Clock, 
  Bell, 
  Award, 
  Calendar, 
  FileCheck,
  Bus
} from 'lucide-react';

const categoryItems = [
  {
    id: 'academics',
    name: 'Academic Performance',
    icon: LineChart,
    path: '/academics',
    color: 'bg-blue-50'
  },
  {
    id: 'attendance',
    name: 'Attendance',
    icon: Clock,
    path: '/attendance',
    color: 'bg-green-50'
  },
  {
    id: 'homework',
    name: 'Homework',
    icon: Book,
    path: '/homework',
    color: 'bg-amber-50'
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: Calendar,
    path: '/calendar',
    color: 'bg-indigo-50'
  },
  {
    id: 'announcements',
    name: 'Announcements',
    icon: Bell,
    path: '/announcements',
    color: 'bg-red-50'
  },
  {
    id: 'messages',
    name: 'Messages',
    icon: MessageSquare,
    path: '/messages',
    color: 'bg-purple-50'
  },
  {
    id: 'fees',
    name: 'Fees & Payments',
    icon: CreditCard,
    path: '/fees',
    color: 'bg-emerald-50'
  },
  {
    id: 'leaves',
    name: 'Apply Leave',
    icon: FileText,
    path: '/leaves',
    color: 'bg-orange-50'
  },
  {
    id: 'results',
    name: 'Exam Results',
    icon: Award,
    path: '/results',
    color: 'bg-violet-50'
  },
  {
    id: 'permission',
    name: 'Permission Forms',
    icon: FileCheck,
    path: '/permission',
    color: 'bg-rose-50'
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: Bus,
    path: '/transport',
    color: 'bg-cyan-50'
  },
  {
    id: 'timetable',
    name: 'Timetable',
    icon: CalendarDays,
    path: '/timetable',
    color: 'bg-yellow-50'
  }
];

const Index = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <Layout title="Dashboard" showProfile={true}>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-5 border card-shadow">
          <h2 className="text-lg font-medium mb-1">Hello, Parent of {studentData.name}</h2>
          <p className="text-sm text-muted-foreground">
            Class {studentData.grade}-{studentData.section} • Roll No. {studentData.rollNumber}
          </p>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {categoryItems.map((item, index) => (
            <Link 
              key={item.id} 
              to={item.path}
              className={`category-icon animate-fade-in transition-all duration-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ 
                animationDelay: `${(index + 1) * 50}ms`,
                transitionDelay: `${(index + 1) * 50}ms` 
              }}
            >
              <div className={`category-icon-inner ${item.color}`}>
                <item.icon size={24} />
              </div>
              <span className="text-xs text-center font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
        
        <div className="bg-white rounded-2xl p-5 border card-shadow">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Upcoming</h3>
            <button className="text-xs text-primary hover:underline">View All</button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center p-3 rounded-xl border hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 mr-3">
                <Calendar size={20} />
              </div>
              <div>
                <p className="font-medium text-sm">Parent-Teacher Meeting</p>
                <p className="text-xs text-muted-foreground">Tomorrow, 9:00 AM - 1:00 PM</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 rounded-xl border hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mr-3">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="font-medium text-sm">Fee Payment Due</p>
                <p className="text-xs text-muted-foreground">5 days left • ₹25,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
