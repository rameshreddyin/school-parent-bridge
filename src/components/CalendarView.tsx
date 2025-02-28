
import { useState } from 'react';
import { Event } from '../utils/mockData';
import { Calendar, CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  events: Event[];
}

const CalendarView = ({ events }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Helper function to get day names
  const getDayNames = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days;
  };
  
  // Helper function to get all days in a month
  const getDaysInMonth = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const calendarDays: (number | null)[] = Array(firstDayOfMonth).fill(null);
    
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }
    
    return calendarDays;
  };
  
  // Helper function to get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long' });
  };
  
  // Helper function to navigate to previous/next month
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  
  // Get days for current month
  const calendarDays = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  
  // Check if a date has events
  const hasEvents = (day: number) => {
    if (!day) return false;
    
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toISOString().split('T')[0];
    
    return events.some(event => event.date === dateToCheck);
  };
  
  // Get events for selected date
  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };
  
  // Get category color
  const getCategoryColor = (category: Event['category']) => {
    switch (category) {
      case 'academic':
        return 'bg-primary text-primary-foreground';
      case 'cultural':
        return 'bg-accent text-accent-foreground';
      case 'sports':
        return 'bg-green-100 text-green-800';
      case 'holiday':
        return 'bg-purple-100 text-purple-800';
      case 'exam':
        return 'bg-red-100 text-red-800';
      case 'meeting':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  
  // Selected date events
  const selectedDateEvents = selectedDate 
    ? getEventsForDate(selectedDate) 
    : [];
  
  return (
    <div className="bg-white rounded-2xl card-shadow p-5 border animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">School Calendar</h3>
        <div className="flex space-x-1">
          <button 
            onClick={() => navigateMonth('prev')}
            className="p-1.5 rounded-full hover:bg-muted/50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={() => navigateMonth('next')}
            className="p-1.5 rounded-full hover:bg-muted/50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      <div className="text-center mb-4">
        <h4 className="font-medium">
          {getMonthName(currentDate)} {currentDate.getFullYear()}
        </h4>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {getDayNames().map((day, index) => (
          <div key={index} className="text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => {
              if (day) {
                const newDate = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                );
                setSelectedDate(newDate);
              }
            }}
            disabled={!day}
            className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative
              ${!day ? 'invisible' : 'hover:bg-muted/50 transition-colors'}
              ${
                selectedDate && 
                day === selectedDate.getDate() && 
                currentDate.getMonth() === selectedDate.getMonth() && 
                currentDate.getFullYear() === selectedDate.getFullYear()
                  ? 'bg-primary/10 text-primary font-medium'
                  : ''
              }
            `}
          >
            {day}
            {hasEvents(day as number) && (
              <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary"></span>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium text-sm mb-2">
          {selectedDate 
            ? `Events on ${selectedDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric'
              })}` 
            : 'Upcoming Events'}
        </h4>
        
        <div className="space-y-2 max-h-[240px] overflow-y-auto subtle-scroll">
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event) => (
              <div key={event.id} className="p-3 rounded-lg border hover:border-primary/30 transition-colors">
                <div className="flex justify-between">
                  <h5 className="font-medium text-sm">{event.title}</h5>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${getCategoryColor(event.category)}`}>
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </span>
                </div>
                
                {event.time && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Time: {event.time}
                  </p>
                )}
                
                {event.location && (
                  <p className="text-xs text-muted-foreground">
                    Location: {event.location}
                  </p>
                )}
                
                {event.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
            ))
          ) : selectedDate ? (
            <div className="text-center py-4">
              <Calendar className="h-10 w-10 mx-auto text-muted-foreground opacity-40" />
              <p className="text-sm text-muted-foreground mt-2">No events scheduled</p>
              <button className="mt-2 text-primary text-sm hover:underline inline-flex items-center">
                <CalendarPlus size={14} className="mr-1" />
                Add Event Request
              </button>
            </div>
          ) : (
            // Show upcoming events across all dates
            events
              .filter(event => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 3)
              .map((event) => {
                const eventDate = new Date(event.date);
                const formattedDate = eventDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                });
                
                return (
                  <div key={event.id} className="p-3 rounded-lg border hover:border-primary/30 transition-colors">
                    <div className="flex justify-between">
                      <h5 className="font-medium text-sm">{event.title}</h5>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${getCategoryColor(event.category)}`}>
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      Date: {formattedDate}
                    </p>
                    
                    {event.time && (
                      <p className="text-xs text-muted-foreground">
                        Time: {event.time}
                      </p>
                    )}
                    
                    {event.location && (
                      <p className="text-xs text-muted-foreground">
                        Location: {event.location}
                      </p>
                    )}
                  </div>
                );
              })
          )}
        </div>
      </div>
      
      <button className="w-full mt-4 text-center text-sm text-primary font-medium py-2 hover:underline">
        View Full Calendar
      </button>
    </div>
  );
};

export default CalendarView;
