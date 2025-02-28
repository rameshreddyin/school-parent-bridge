
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import PerformanceChart from '../components/PerformanceChart';
import AttendanceCard from '../components/AttendanceCard';
import AnnouncementCard from '../components/AnnouncementCard';
import MessageCenter from '../components/MessageCenter';
import CalendarView from '../components/CalendarView';
import FeePayment from '../components/FeePayment';
import { 
  studentData, 
  attendanceData, 
  announcementData, 
  subjectData, 
  messageData, 
  eventData, 
  feeData 
} from '../utils/mockData';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <Layout title="Dashboard">
      <div className="grid gap-5">
        <div className={`transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <PerformanceChart subjects={subjectData} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className={`transition-all duration-500 delay-150 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <AttendanceCard attendanceData={attendanceData} />
          </div>
          
          <div className={`transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <AnnouncementCard announcements={announcementData} />
          </div>
        </div>
        
        <div className={`transition-all duration-500 delay-250 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <CalendarView events={eventData} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className={`transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <MessageCenter messages={messageData} />
          </div>
          
          <div className={`transition-all duration-500 delay-350 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <FeePayment fees={feeData} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
