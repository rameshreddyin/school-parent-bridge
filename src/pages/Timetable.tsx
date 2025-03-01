
import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { studentData } from "../utils/mockData";

interface TimeSlot {
  time: string;
  subject: string;
  teacher: string;
  room?: string;
}

interface DaySchedule {
  day: string;
  slots: TimeSlot[];
}

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Mock timetable data
const timetableData: DaySchedule[] = [
  {
    day: "Monday",
    slots: [
      { time: "08:30 - 09:20", subject: "Mathematics", teacher: "Mrs. Patel", room: "Room 101" },
      { time: "09:25 - 10:15", subject: "English", teacher: "Mr. Sharma", room: "Room 103" },
      { time: "10:15 - 10:30", subject: "Break", teacher: "", room: "" },
      { time: "10:30 - 11:20", subject: "Physics", teacher: "Mr. Kumar", room: "Lab 2" },
      { time: "11:25 - 12:15", subject: "Chemistry", teacher: "Mrs. Joshi", room: "Lab 1" },
      { time: "12:15 - 13:00", subject: "Lunch", teacher: "", room: "" },
      { time: "13:00 - 13:50", subject: "Computer Science", teacher: "Mr. Singh", room: "Computer Lab" },
      { time: "13:55 - 14:45", subject: "Physical Education", teacher: "Mr. Rao", room: "Playground" },
    ],
  },
  {
    day: "Tuesday",
    slots: [
      { time: "08:30 - 09:20", subject: "Physics", teacher: "Mr. Kumar", room: "Lab 2" },
      { time: "09:25 - 10:15", subject: "Mathematics", teacher: "Mrs. Patel", room: "Room 101" },
      { time: "10:15 - 10:30", subject: "Break", teacher: "", room: "" },
      { time: "10:30 - 11:20", subject: "Hindi", teacher: "Mrs. Reddy", room: "Room 104" },
      { time: "11:25 - 12:15", subject: "Biology", teacher: "Mrs. Gupta", room: "Lab 3" },
      { time: "12:15 - 13:00", subject: "Lunch", teacher: "", room: "" },
      { time: "13:00 - 13:50", subject: "History", teacher: "Mr. Verma", room: "Room 105" },
      { time: "13:55 - 14:45", subject: "Geography", teacher: "Mrs. Iyer", room: "Room 106" },
    ],
  },
  {
    day: "Wednesday",
    slots: [
      { time: "08:30 - 09:20", subject: "Chemistry", teacher: "Mrs. Joshi", room: "Lab 1" },
      { time: "09:25 - 10:15", subject: "Biology", teacher: "Mrs. Gupta", room: "Lab 3" },
      { time: "10:15 - 10:30", subject: "Break", teacher: "", room: "" },
      { time: "10:30 - 11:20", subject: "Mathematics", teacher: "Mrs. Patel", room: "Room 101" },
      { time: "11:25 - 12:15", subject: "English", teacher: "Mr. Sharma", room: "Room 103" },
      { time: "12:15 - 13:00", subject: "Lunch", teacher: "", room: "" },
      { time: "13:00 - 13:50", subject: "Art", teacher: "Ms. Malhotra", room: "Art Room" },
      { time: "13:55 - 14:45", subject: "Music", teacher: "Mr. Kapoor", room: "Music Room" },
    ],
  },
  {
    day: "Thursday",
    slots: [
      { time: "08:30 - 09:20", subject: "Hindi", teacher: "Mrs. Reddy", room: "Room 104" },
      { time: "09:25 - 10:15", subject: "Physics", teacher: "Mr. Kumar", room: "Lab 2" },
      { time: "10:15 - 10:30", subject: "Break", teacher: "", room: "" },
      { time: "10:30 - 11:20", subject: "Chemistry", teacher: "Mrs. Joshi", room: "Lab 1" },
      { time: "11:25 - 12:15", subject: "Computer Science", teacher: "Mr. Singh", room: "Computer Lab" },
      { time: "12:15 - 13:00", subject: "Lunch", teacher: "", room: "" },
      { time: "13:00 - 13:50", subject: "Mathematics", teacher: "Mrs. Patel", room: "Room 101" },
      { time: "13:55 - 14:45", subject: "Library", teacher: "Mrs. Das", room: "Library" },
    ],
  },
  {
    day: "Friday",
    slots: [
      { time: "08:30 - 09:20", subject: "English", teacher: "Mr. Sharma", room: "Room 103" },
      { time: "09:25 - 10:15", subject: "Mathematics", teacher: "Mrs. Patel", room: "Room 101" },
      { time: "10:15 - 10:30", subject: "Break", teacher: "", room: "" },
      { time: "10:30 - 11:20", subject: "Hindi", teacher: "Mrs. Reddy", room: "Room 104" },
      { time: "11:25 - 12:15", subject: "Social Studies", teacher: "Mr. Agarwal", room: "Room 107" },
      { time: "12:15 - 13:00", subject: "Lunch", teacher: "", room: "" },
      { time: "13:00 - 13:50", subject: "Physics", teacher: "Mr. Kumar", room: "Lab 2" },
      { time: "13:55 - 14:45", subject: "Chemistry", teacher: "Mrs. Joshi", room: "Lab 1" },
    ],
  },
  {
    day: "Saturday",
    slots: [
      { time: "08:30 - 09:20", subject: "Physical Education", teacher: "Mr. Rao", room: "Playground" },
      { time: "09:25 - 10:15", subject: "Club Activities", teacher: "Various", room: "Various" },
      { time: "10:15 - 10:30", subject: "Break", teacher: "", room: "" },
      { time: "10:30 - 11:20", subject: "Club Activities", teacher: "Various", room: "Various" },
      { time: "11:25 - 12:15", subject: "Class Meeting", teacher: "Class Teacher", room: "Room 101" },
    ],
  },
];

const Timetable = () => {
  const [activeDay, setActiveDay] = useState<string>("Monday");
  const currentDayData = timetableData.find((day) => day.day === activeDay) || timetableData[0];
  const dayIndex = weekdays.indexOf(activeDay);

  const handlePrevDay = () => {
    const prevIndex = (dayIndex - 1 + weekdays.length) % weekdays.length;
    setActiveDay(weekdays[prevIndex]);
  };

  const handleNextDay = () => {
    const nextIndex = (dayIndex + 1) % weekdays.length;
    setActiveDay(weekdays[nextIndex]);
  };

  return (
    <Layout title="Timetable">
      <div className="space-y-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Class Timetable</CardTitle>
              <div className="text-sm text-muted-foreground">
                Class {studentData.grade}-{studentData.section}
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            <TabsTrigger value="daily">Daily View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekly" className="mt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {timetableData.map((day) => (
                <Card key={day.day} className="overflow-hidden border shadow-sm">
                  <CardHeader className="bg-primary/5 py-3">
                    <CardTitle className="text-base font-medium">{day.day}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {day.slots.map((slot, index) => (
                        <div 
                          key={index} 
                          className={`flex items-start p-3 ${slot.subject === 'Break' || slot.subject === 'Lunch' ? 'bg-muted/30' : ''}`}
                        >
                          <div className="mr-3 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{slot.subject}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">{slot.time}</p>
                              {slot.teacher && (
                                <p className="text-xs text-muted-foreground">{slot.teacher} • {slot.room}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="daily" className="mt-4">
            <Card className="border shadow-sm">
              <CardHeader className="bg-primary/5 py-4">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handlePrevDay}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-base font-medium">{activeDay}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleNextDay}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {currentDayData.slots.map((slot, index) => (
                    <div 
                      key={index} 
                      className={`flex items-start p-4 ${slot.subject === 'Break' || slot.subject === 'Lunch' ? 'bg-muted/30' : ''}`}
                    >
                      <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-medium">{slot.subject}</p>
                        <p className="text-sm text-muted-foreground">{slot.time}</p>
                        {slot.teacher && (
                          <p className="mt-1 text-sm text-muted-foreground">{slot.teacher} • {slot.room}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Timetable;
