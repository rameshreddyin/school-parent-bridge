import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Search, Filter, Check, X, Clock, MapPin, Send } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Mock calendar events data
const mockEvents = [
  {
    id: 'evt1',
    title: 'Parent-Teacher Meeting',
    date: '2023-06-15',
    time: '14:00-16:00',
    location: 'School Auditorium',
    type: 'meeting'
  },
  {
    id: 'evt2',
    title: 'Annual Sports Day',
    date: '2023-06-20',
    time: '09:00-17:00',
    location: 'School Playground',
    type: 'event'
  },
  {
    id: 'evt3',
    title: 'Science Project Submission',
    date: '2023-06-25',
    time: '10:00',
    location: 'Science Lab',
    type: 'academic'
  },
  {
    id: 'evt4',
    title: 'Math Test',
    date: '2023-06-10',
    time: '09:30-10:30',
    location: 'Classroom 5B',
    type: 'exam'
  },
  {
    id: 'evt5',
    title: 'School Holiday - Summer Break Begins',
    date: '2023-06-30',
    time: 'All day',
    location: '',
    type: 'holiday'
  }
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'agenda'>('month');
  const [events, setEvents] = useState(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Track scroll position for UI effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handlePreviousMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };
  
  const handleEventClick = (event: typeof mockEvents[0]) => {
    setSelectedEvent(event);
    setEventDialogOpen(true);
  };
  
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'event':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'academic':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'exam':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'holiday':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Generate the days for the month view
  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Create an array for all days in the calendar view (including from previous/next months)
    const calendarDays = [];
    
    // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const startDay = monthStart.getDay();
    
    // Add days from previous month to fill the first row
    for (let i = startDay; i > 0; i--) {
      const prevMonthDay = new Date(monthStart);
      prevMonthDay.setDate(prevMonthDay.getDate() - i);
      calendarDays.push(prevMonthDay);
    }
    
    // Add all days in the current month
    daysInMonth.forEach(day => {
      calendarDays.push(day);
    });
    
    // Add days from next month to complete the last row
    const lastDay = calendarDays[calendarDays.length - 1].getDay();
    for (let i = 1; i < 7 - lastDay; i++) {
      const nextMonthDay = new Date(monthEnd);
      nextMonthDay.setDate(nextMonthDay.getDate() + i);
      calendarDays.push(nextMonthDay);
    }
    
    return calendarDays;
  };
  
  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, day);
    });
  };
  
  // Render month view
  const renderMonthView = () => {
    const calendarDays = getDaysInMonth();
    
    return (
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="grid grid-cols-7 text-center border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={index} className="py-2 font-medium text-sm">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const dayEvents = getEventsForDay(day);
            const isCurrentDay = isToday(day);
            
            return (
              <div 
                key={index} 
                className={`min-h-24 p-1 border-b border-r ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${isCurrentDay ? 'bg-blue-50' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium ${
                    isCurrentDay ? 'bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center' : ''
                  }`}>
                    {day.getDate()}
                  </span>
                  {dayEvents.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {dayEvents.length}
                    </Badge>
                  )}
                </div>
                
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 2).map((event, eventIndex) => (
                    <div 
                      key={eventIndex}
                      className={`text-xs p-1 rounded-md truncate cursor-pointer ${getEventTypeColor(event.type)}`}
                      onClick={() => handleEventClick(event)}
                    >
                      {event.title}
                    </div>
                  ))}
                  
                  {dayEvents.length > 2 && (
                    <div 
                      className="text-xs text-blue-600 cursor-pointer pl-1"
                      onClick={() => toast.info(`${dayEvents.length - 2} more events`)}
                    >
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Render agenda view (simplified list of upcoming events)
  const renderAgendaView = () => {
    const sortedEvents = [...events].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    return (
      <div className="space-y-3">
        {sortedEvents.map((event, index) => (
          <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="bg-gray-100 rounded-xl p-2 h-12 w-12 flex flex-col items-center justify-center">
                  <span className="text-xs font-medium">{format(parseISO(event.date), 'MMM')}</span>
                  <span className="text-lg font-bold">{format(parseISO(event.date), 'd')}</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-base">{event.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge 
                      variant="secondary" 
                      className={`${getEventTypeColor(event.type)} text-xs font-normal`}
                    >
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </Badge>
                    
                    <span className="text-xs text-muted-foreground">{event.time}</span>
                    
                    {event.location && (
                      <span className="text-xs text-muted-foreground">
                        @ {event.location}
                      </span>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handleEventClick(event)}
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <Layout 
      title={scrollY > 10 ? 'Calendar' : undefined}
      showBackButton={true}
    >
      <div className="space-y-4 pb-20">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display">Calendar</h1>
          <p className="text-muted-foreground">View and manage school events</p>
        </div>
        
        <div className="flex items-center justify-between sticky top-[73px] z-10 bg-background pb-2">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePreviousMonth}
            >
              <ChevronLeft size={18} />
            </Button>
            
            <h2 className="text-lg font-medium">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNextMonth}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-9" onClick={() => toast.info("Search feature coming soon")}>
              <Search size={14} className="mr-1" />
              Search
            </Button>
            
            <Button variant="outline" size="sm" className="h-9" onClick={() => toast.info("Filter feature coming soon")}>
              <Filter size={14} className="mr-1" />
              Filter
            </Button>
          </div>
        </div>
        
        <Tabs 
          defaultValue="month" 
          value={currentView} 
          onValueChange={value => setCurrentView(value as typeof currentView)}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3 h-10">
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
          </TabsList>
          
          <TabsContent value="month" className="animate-in fade-in-50 duration-500">
            {renderMonthView()}
          </TabsContent>
          
          <TabsContent value="week" className="animate-in fade-in-50 duration-500">
            <div className="p-8 text-center">
              <CalendarIcon size={48} className="mx-auto text-muted-foreground opacity-50" />
              <h3 className="mt-3 font-medium">Week View Coming Soon</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This feature is under development
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="agenda" className="animate-in fade-in-50 duration-500">
            {renderAgendaView()}
          </TabsContent>
        </Tabs>
        
        {/* Event Details Dialog */}
        <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">Event Details</DialogTitle>
            </DialogHeader>
            
            {selectedEvent && (
              <div className="space-y-4 pt-2">
                <h2 className="text-lg font-semibold">{selectedEvent.title}</h2>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CalendarIcon size={18} className="text-muted-foreground mr-2" />
                    <span>
                      {format(parseISO(selectedEvent.date), 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  
                  {selectedEvent.time !== 'All day' && (
                    <div className="flex items-center">
                      <Clock size={18} className="text-muted-foreground mr-2" />
                      <span>{selectedEvent.time}</span>
                    </div>
                  )}
                  
                  {selectedEvent.location && (
                    <div className="flex items-center">
                      <MapPin size={18} className="text-muted-foreground mr-2" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                </div>
                
                <Badge className={`${getEventTypeColor(selectedEvent.type)}`}>
                  {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                </Badge>
                
                <div className="flex space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setEventDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      toast.success("Event details sent to your email");
                      setEventDialogOpen(false);
                    }}
                  >
                    <Send size={16} className="mr-1" />
                    Get Reminder
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Floating Action Button */}
        <Button
          className="fixed right-4 bottom-20 rounded-full w-12 h-12 shadow-lg"
          onClick={() => toast.info("Add event feature coming soon")}
        >
          <Plus size={20} />
        </Button>
      </div>
    </Layout>
  );
};

export default Calendar;
