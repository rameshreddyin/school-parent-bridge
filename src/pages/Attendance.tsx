
import { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { attendanceData, studentData } from '../utils/mockData';
import { Calendar, Check, Clock, X, CalendarCheck, ChevronDown, ChevronRight, Filter, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, subMonths, isToday, startOfToday, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Status = 'present' | 'absent' | 'late';

const Attendance = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'reports'>('overview');
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [monthlyStats, setMonthlyStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    total: 0,
    percentage: 0,
  });
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [monthlyAttendance, setMonthlyAttendance] = useState<Array<{date: string, status: Status}>>([]);
  const startRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Get attendance data for the selected month
  useEffect(() => {
    // This would be an API call in a real app
    // For now, we'll filter the dummy data
    const currentMonth = startOfMonth(selectedMonth);
    const endMonth = endOfMonth(selectedMonth);
    
    // Get all days in the month
    const days = eachDayOfInterval({ start: currentMonth, end: endMonth });
    
    // Create attendance entries
    const monthAttendance = days.map(day => {
      // Find if there's an attendance record for this day
      const found = attendanceData.find(att => {
        const attDate = parseISO(att.date);
        return isSameDay(attDate, day);
      });
      
      if (found) {
        return found;
      } else {
        // For days without records, return an empty placeholder
        // In a real app, these might be future dates or holidays
        return {
          date: day.toISOString().split('T')[0],
          status: isSameMonth(day, new Date()) && day > new Date() 
            ? 'present' // Future dates in current month (placeholder)
            : 'absent' // Past dates with no record (assumed absent)
        };
      }
    });
    
    setMonthlyAttendance(monthAttendance);
    
    // Calculate statistics
    const present = monthAttendance.filter(a => a.status === 'present').length;
    const absent = monthAttendance.filter(a => a.status === 'absent').length;
    const late = monthAttendance.filter(a => a.status === 'late').length;
    const total = monthAttendance.length;
    const percentage = Math.round((present / (total || 1)) * 100);
    
    setMonthlyStats({ present, absent, late, total, percentage });
  }, [selectedMonth]);

  // Track scroll position for UI effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      toast.success('Attendance data refreshed');
      setIsRefreshing(false);
    }, 1500);
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    setSelectedMonth(prev => {
      if (direction === 'prev') {
        return subMonths(prev, 1);
      } else {
        return new Date(prev.getFullYear(), prev.getMonth() + 1);
      }
    });
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-700';
      case 'absent':
        return 'bg-red-100 text-red-700';
      case 'late':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'present':
        return <Check size={14} className="mr-1" />;
      case 'absent':
        return <X size={14} className="mr-1" />;
      case 'late':
        return <Clock size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  // Last 5 attendance records
  const recentAttendance = [...attendanceData].slice(-5).reverse();

  // Weekly overview (simplified for this demo)
  const weeklyData = [
    { day: 'Mon', status: 'present' },
    { day: 'Tue', status: 'present' },
    { day: 'Wed', status: 'late' },
    { day: 'Thu', status: 'present' },
    { day: 'Fri', status: 'absent' },
    { day: 'Sat', status: '' }, // Weekend
    { day: 'Sun', status: '' }  // Weekend
  ];

  return (
    <Layout 
      title={scrollY > 10 ? 'Attendance' : undefined} 
      showBackButton={true}
    >
      <div className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display">Attendance</h1>
          <p className="text-muted-foreground">Track and view attendance records</p>
        </div>

        <Tabs 
          defaultValue="overview" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as typeof activeTab)}
          className="w-full"
        >
          <div className="sticky top-[73px] z-10 bg-background pb-2">
            <TabsList className="w-full grid grid-cols-3 h-12">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="space-y-4 animate-in fade-in-50 duration-500">
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <div 
                  className="flex justify-between items-center" 
                  ref={startRef}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">Attendance Rate</h3>
                      <Badge variant="outline" className="font-normal">
                        This month
                      </Badge>
                    </div>
                    <div className="flex items-baseline space-x-1 mt-1">
                      <span className="text-3xl font-bold">{monthlyStats.percentage}%</span>
                      <span className="text-sm text-muted-foreground">
                        ({monthlyStats.present}/{monthlyStats.total} days)
                      </span>
                    </div>
                  </div>
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <CalendarCheck size={28} className="text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex space-x-3">
              <Card className="border-none shadow-sm grow">
                <CardContent className="p-4 text-center">
                  <div className="text-sm text-muted-foreground">Present</div>
                  <div className="font-bold text-xl mt-1">{monthlyStats.present}</div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm grow">
                <CardContent className="p-4 text-center">
                  <div className="text-sm text-muted-foreground">Absent</div>
                  <div className="font-bold text-xl mt-1">{monthlyStats.absent}</div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm grow">
                <CardContent className="p-4 text-center">
                  <div className="text-sm text-muted-foreground">Late</div>
                  <div className="font-bold text-xl mt-1">{monthlyStats.late}</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">This Week</h3>
              </div>
              <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {weeklyData.map((day, index) => (
                      <div 
                        key={index} 
                        className={`flex flex-col items-center py-2 rounded-lg ${
                          day.status ? 
                            day.status === 'present' ? 'bg-green-50' : 
                            day.status === 'absent' ? 'bg-red-50' : 'bg-amber-50'
                          : 'bg-gray-50'
                        }`}
                      >
                        <span className="text-xs text-muted-foreground">{day.day}</span>
                        {day.status ? (
                          <div className="mt-1">
                            {day.status === 'present' && <Check size={16} className="text-green-600" />}
                            {day.status === 'absent' && <X size={16} className="text-red-600" />}
                            {day.status === 'late' && <Clock size={16} className="text-amber-600" />}
                          </div>
                        ) : (
                          <span className="text-xs mt-1">-</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Recent Attendance</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={handleRefresh}
                >
                  <RefreshCw size={14} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              
              <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                  {recentAttendance.map((item, index) => {
                    const date = parseISO(item.date);
                    const formattedDate = isToday(date) 
                      ? 'Today' 
                      : format(date, 'EEE, d MMM');
                    
                    return (
                      <div 
                        key={index}
                        className={`p-4 flex justify-between items-center ${
                          index !== recentAttendance.length - 1 ? 'border-b' : ''
                        }`}
                      >
                        <div>
                          <div className="font-medium text-sm">{formattedDate}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(date, 'MMMM yyyy')}
                          </div>
                        </div>
                        <Badge 
                          className={`${getStatusColor(item.status)} border-none`}
                        >
                          <div className="flex items-center">
                            {getStatusIcon(item.status)}
                            <span className="capitalize">{item.status}</span>
                          </div>
                        </Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4 animate-in fade-in-50 duration-500">
            <div className="flex justify-between items-center sticky top-[125px] z-10 bg-background pb-2">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => changeMonth('prev')}
                >
                  <ChevronDown size={18} className="rotate-90" />
                </Button>
                <h3 className="font-medium">
                  {format(selectedMonth, 'MMMM yyyy')}
                </h3>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => changeMonth('next')}
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
              
              <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter size={14} className="mr-1" />
                    Filter
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Filter Attendance</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="late">Late</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Range</label>
                      <Select defaultValue="month">
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="semester">This Semester</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="pt-2 flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowFilterDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => {
                        toast.success("Filters applied");
                        setShowFilterDialog(false);
                      }}>
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <Card className="border-none shadow-sm">
              <CardContent className="p-0">
                <div className="grid grid-cols-7 text-center border-b">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={index} className="p-3 text-xs font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1 p-2">
                  {/* This is a simplified approach - in a real app, you would calculate proper calendar view */}
                  {monthlyAttendance.map((day, index) => {
                    const date = parseISO(day.date);
                    const isToday = isSameDay(date, startOfToday());
                    
                    return (
                      <div 
                        key={index}
                        className={`p-2 rounded-md flex flex-col items-center justify-center min-h-12
                          ${isToday ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'}
                        `}
                      >
                        <span className="text-xs font-medium mb-1">
                          {format(date, 'd')}
                        </span>
                        
                        {day.status && (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                            ${day.status === 'present' ? 'bg-green-500 text-white' : 
                              day.status === 'absent' ? 'bg-red-500 text-white' : 
                              'bg-amber-500 text-white'
                            }
                          `}>
                            {day.status === 'present' ? 'P' : day.status === 'absent' ? 'A' : 'L'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex items-center justify-center space-x-4 pt-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Present</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs">Absent</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs">Late</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4 animate-in fade-in-50 duration-500">
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Attendance Summary</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Attendance</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>This Semester</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Previous Semester</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Monthly Statistics</h3>
                
                <div className="space-y-3">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                    // Generate random percentages for demo
                    const percent = 70 + Math.floor(Math.random() * 25);
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{month} 2023</span>
                          <span className="font-medium">{percent}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              percent >= 90 ? 'bg-green-500' : 
                              percent >= 75 ? 'bg-primary' : 
                              'bg-amber-500'
                            }`} 
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <Button className="w-full mt-4" variant="outline">
                  Download Full Report
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Absences Review</h3>
                </div>
                
                <div className="space-y-4">
                  {attendanceData.filter(item => item.status === 'absent').slice(0, 3).map((item, index) => {
                    const date = parseISO(item.date);
                    return (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-muted/40 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                          <User size={20} className="text-red-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            Absent: {format(date, 'EEEE, MMMM d, yyyy')}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.reason || 'No reason provided'}
                          </div>
                          {!item.reason && (
                            <Button 
                              size="sm" 
                              variant="link" 
                              className="h-auto p-0 text-xs mt-1"
                              onClick={() => toast.info('Feature coming soon')}
                            >
                              + Add reason
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="flex justify-center">
                    <Button variant="ghost" className="text-sm" onClick={() => toast.info('Feature coming soon')}>
                      View All Absences
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Attendance;
