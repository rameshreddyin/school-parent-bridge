
import { Attendance } from '../utils/mockData';
import { Check, Clock, X } from 'lucide-react';

interface AttendanceCardProps {
  attendanceData: Attendance[];
}

const AttendanceCard = ({ attendanceData }: AttendanceCardProps) => {
  // Calculate attendance statistics
  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter(item => item.status === 'present').length;
  const absentDays = attendanceData.filter(item => item.status === 'absent').length;
  const lateDays = attendanceData.filter(item => item.status === 'late').length;
  
  const attendancePercentage = Math.round((presentDays / totalDays) * 100);
  
  // Get last 5 days
  const recentAttendance = [...attendanceData].slice(-5).reverse();

  return (
    <div className="bg-white rounded-2xl card-shadow p-5 border animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">Attendance</h3>
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 text-primary font-semibold">
            {attendancePercentage}%
          </div>
        </div>
      </div>
      
      <div className="flex space-x-3 mb-4">
        <div className="flex-1 bg-muted rounded-lg p-2 text-center">
          <p className="text-xs text-muted-foreground">Present</p>
          <p className="font-semibold">{presentDays}</p>
        </div>
        <div className="flex-1 bg-muted rounded-lg p-2 text-center">
          <p className="text-xs text-muted-foreground">Absent</p>
          <p className="font-semibold">{absentDays}</p>
        </div>
        <div className="flex-1 bg-muted rounded-lg p-2 text-center">
          <p className="text-xs text-muted-foreground">Late</p>
          <p className="font-semibold">{lateDays}</p>
        </div>
      </div>
      
      <h4 className="text-sm font-medium mb-2">Recent Attendance</h4>
      <div className="space-y-2">
        {recentAttendance.map((day, index) => {
          const date = new Date(day.date);
          const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          });
          
          return (
            <div 
              key={index} 
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm">{formattedDate}</span>
              
              <div className="flex items-center">
                {day.status === 'present' ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                    <Check size={12} className="mr-1" /> Present
                  </span>
                ) : day.status === 'absent' ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                    <X size={12} className="mr-1" /> Absent
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                    <Clock size={12} className="mr-1" /> Late
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 text-center text-sm text-primary font-medium py-2 hover:underline">
        View Full Attendance
      </button>
    </div>
  );
};

export default AttendanceCard;
