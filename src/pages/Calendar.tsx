
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, MapPin, Clock, ChevronRight, Plus, Calendar as CalendarComponent } from 'lucide-react';
import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { format } from 'date-fns';
import { eventData } from '../utils/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Event category colors
const categoryColors: Record<string, { bg: string, text: string, dot: string }> = {
  academic: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  cultural: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  sports: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  holiday: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  exam: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  meeting: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' }
};

// Function to group events by date
const groupEventsByDate = (events: typeof eventData) => {
  const grouped: Record<string, typeof eventData> = {};
  
  events.forEach(event => {
    if (!grouped[event.date]) {
      grouped[event.date] = [];
    }
    grouped[event.date].push(event);
  });
  
  return grouped;
};

const Calendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('month');
  const [viewingAllEvents, setViewingAllEvents] = useState(false);
  
  // Filter events for the selected month
  const eventsInSelectedMonth = eventData.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === date.getMonth() && eventDate.getFullYear() === date.getFullYear();
  });
  
  // Group events by date for agenda view
  const groupedEvents = groupEventsByDate(eventsInSelectedMonth);
  
  // Generate dates for the month
  const datesInMonth: Date[] = [];
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  for (let d = firstDayOfMonth; d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) {
    datesInMonth.push(new Date(d));
  }
  
  // Check if a date has events
  const hasEvents = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return groupedEvents[dateString] && groupedEvents[dateString].length > 0;
  };
  
  // Format date to "YYYY-MM-DD" for lookup
  const formatDateForLookup = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };

  return (
    <Layout title="Calendar" showBackButton>
      <div className="space-y-4">
        <Tabs defaultValue="month" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
          </TabsList>

          {/* Month View */}
          <TabsContent value="month" className="space-y-4">
            <div className="bg-white rounded-lg">
              <CalendarUI
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border"
              />
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <h3 className="font-semibold">Events ({eventsInSelectedMonth.length})</h3>
              <Dialog open={viewingAllEvents} onOpenChange={setViewingAllEvents}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>All Events - {format(date, 'MMMM yyyy')}</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[60vh] overflow-y-auto pr-2 mt-2 space-y-3">
                    {eventsInSelectedMonth.length > 0 ? (
                      eventsInSelectedMonth.map(event => (
                        <Card key={event.id} className={`${categoryColors[event.category]?.bg || 'bg-gray-50'} border-none`}>
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <h4 className={`font-medium ${categoryColors[event.category]?.text || 'text-gray-700'}`}>
                                  {event.title}
                                </h4>
                                <div className="text-xs text-muted-foreground space-y-1">
                                  <div className="flex items-center">
                                    <CalendarIcon className="h-3 w-3 mr-1" />
                                    <span>
                                      {new Date(event.date).toLocaleDateString('en-IN', {
                                        weekday: 'short',
                                        day: 'numeric',
                                        month: 'short'
                                      })}
                                    </span>
                                  </div>
                                  
                                  {event.time && (
                                    <div className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      <span>{event.time}</span>
                                    </div>
                                  )}
                                  
                                  {event.location && (
                                    <div className="flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      <span>{event.location}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Badge className="capitalize">
                                {event.category}
                              </Badge>
                            </div>
                            
                            {event.description && (
                              <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                                {event.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <CalendarComponent className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>No events this month</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-450px)] overflow-y-auto pr-1 subtle-scroll">
              {eventsInSelectedMonth.length > 0 ? (
                eventsInSelectedMonth.slice(0, 3).map(event => (
                  <Card key={event.id} className={`${categoryColors[event.category]?.bg || 'bg-gray-50'} border-none`}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className={`font-medium ${categoryColors[event.category]?.text || 'text-gray-700'}`}>
                            {event.title}
                          </h4>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div className="flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              <span>
                                {new Date(event.date).toLocaleDateString('en-IN', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short'
                                })}
                              </span>
                            </div>
                            
                            {event.time && (
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{event.time}</span>
                              </div>
                            )}
                            
                            {event.location && (
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge className="capitalize">
                          {event.category}
                        </Badge>
                      </div>
                      
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                          {event.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarComponent className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No events this month</p>
                </div>
              )}
              
              {eventsInSelectedMonth.length > 3 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-primary"
                  onClick={() => setViewingAllEvents(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Show {eventsInSelectedMonth.length - 3} more events
                </Button>
              )}
            </div>
          </TabsContent>

          {/* Agenda View */}
          <TabsContent value="agenda" className="space-y-4">
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="text-center mb-2">
                <h3 className="font-medium">{format(date, 'MMMM yyyy')}</h3>
              </div>
              <div className="flex flex-wrap gap-1 justify-center">
                {datesInMonth.map((d, i) => {
                  const isToday = new Date().toDateString() === d.toDateString();
                  const hasEventsForDate = hasEvents(d);
                  
                  return (
                    <button
                      key={i}
                      className={`
                        w-9 h-9 rounded-full flex items-center justify-center text-xs relative 
                        ${isToday ? 'bg-primary text-white' : 'hover:bg-muted'}
                        ${d.toDateString() === date.toDateString() && !isToday ? 'border border-primary text-primary' : ''}
                      `}
                      onClick={() => setDate(new Date(d))}
                    >
                      {d.getDate()}
                      {hasEventsForDate && !isToday && (
                        <span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <h3 className="font-semibold">Events for {format(date, 'MMMM d, yyyy')}</h3>
            
            <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 subtle-scroll">
              {groupedEvents[formatDateForLookup(date)]?.length > 0 ? (
                groupedEvents[formatDateForLookup(date)].map(event => (
                  <Card key={event.id} className={`${categoryColors[event.category]?.bg || 'bg-gray-50'} border-none`}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className={`font-medium ${categoryColors[event.category]?.text || 'text-gray-700'}`}>
                            {event.title}
                          </h4>
                          <div className="text-xs text-muted-foreground space-y-1">
                            {event.time && (
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{event.time}</span>
                              </div>
                            )}
                            
                            {event.location && (
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge className="capitalize">
                          {event.category}
                        </Badge>
                      </div>
                      
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                          {event.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarComponent className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No events for this day</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Calendar;
