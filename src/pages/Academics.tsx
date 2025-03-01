
import { useState } from 'react';
import Layout from '../components/Layout';
import { Book, Award, Calendar, Clock, FileText, Download, ChevronRight, BarChart2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for subjects
const subjects = [
  { id: 1, name: 'Mathematics', teacher: 'Ms. Johnson', grade: 'A', percentage: 92, lastAssessment: '2023-05-15' },
  { id: 2, name: 'Science', teacher: 'Mr. Thompson', grade: 'A-', percentage: 88, lastAssessment: '2023-05-10' },
  { id: 3, name: 'English', teacher: 'Mrs. Davis', grade: 'B+', percentage: 85, lastAssessment: '2023-05-12' },
  { id: 4, name: 'History', teacher: 'Mr. Wilson', grade: 'A', percentage: 90, lastAssessment: '2023-05-08' },
  { id: 5, name: 'Computer Science', teacher: 'Mr. Garcia', grade: 'A+', percentage: 95, lastAssessment: '2023-05-05' }
];

// Mock data for upcoming tests
const upcomingTests = [
  { id: 1, subject: 'Mathematics', topic: 'Algebra', date: '2023-06-10', time: '09:00 AM', duration: '1 hour' },
  { id: 2, subject: 'Science', topic: 'Chemistry', date: '2023-06-15', time: '10:30 AM', duration: '1 hour' },
  { id: 3, subject: 'English', topic: 'Literature', date: '2023-06-18', time: '11:00 AM', duration: '45 mins' }
];

// Mock data for syllabus
const syllabusList = [
  { id: 1, subject: 'Mathematics', units: 8, completed: 5, documents: ['Algebra', 'Geometry', 'Trigonometry'] },
  { id: 2, subject: 'Science', units: 10, completed: 7, documents: ['Physics', 'Chemistry', 'Biology'] },
  { id: 3, subject: 'English', units: 6, completed: 4, documents: ['Grammar', 'Literature', 'Composition'] },
  { id: 4, subject: 'History', units: 5, completed: 3, documents: ['Ancient History', 'Modern History'] },
  { id: 5, subject: 'Computer Science', units: 7, completed: 5, documents: ['Programming', 'Data Structures', 'Web Development'] }
];

// Performance data for chart
const performanceData = [
  { subject: 'Math', score: 92, average: 78 },
  { subject: 'Science', score: 88, average: 75 },
  { subject: 'English', score: 85, average: 80 },
  { subject: 'History', score: 90, average: 72 },
  { subject: 'CS', score: 95, average: 82 }
];

const Academics = () => {
  const [activeTab, setActiveTab] = useState<'subjects' | 'tests' | 'syllabus' | 'performance'>('subjects');
  
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    if (grade.startsWith('D')) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };
  
  const renderSubjects = () => {
    return (
      <div className="space-y-4">
        {subjects.map(subject => (
          <Card key={subject.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{subject.name}</h3>
                  <p className="text-sm text-muted-foreground">Teacher: {subject.teacher}</p>
                </div>
                <Badge className={getGradeColor(subject.grade)}>
                  {subject.grade}
                </Badge>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span className="font-medium">{subject.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full bg-primary" 
                    style={{ width: `${subject.percentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <div className="text-xs text-muted-foreground">
                  Last assessment: {new Date(subject.lastAssessment).toLocaleDateString()}
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronRight size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderUpcomingTests = () => {
    return (
      <div className="space-y-4">
        {upcomingTests.map(test => (
          <Card key={test.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between">
                <h3 className="font-medium">{test.subject}</h3>
                <Badge variant="outline">{test.topic}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-y-2 mt-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{new Date(test.date).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{test.time}</span>
                </div>
                
                <div className="col-span-2 flex items-center mt-1">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{test.duration}</span>
                </div>
              </div>
              
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => toast.success(`Reminder set for ${test.subject} test`)}
                >
                  Set Reminder
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <div className="text-center">
          <Button 
            variant="link" 
            onClick={() => toast.info("View all tests feature coming soon")}
          >
            View All Tests
          </Button>
        </div>
      </div>
    );
  };
  
  const renderSyllabus = () => {
    return (
      <div className="space-y-4">
        {syllabusList.map(syllabus => (
          <Card key={syllabus.id} className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{syllabus.subject}</h3>
                  <p className="text-sm text-muted-foreground">
                    {syllabus.completed} of {syllabus.units} units completed
                  </p>
                </div>
                <Badge variant="outline">
                  {Math.round((syllabus.completed / syllabus.units) * 100)}%
                </Badge>
              </div>
              
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full bg-primary" 
                    style={{ width: `${(syllabus.completed / syllabus.units) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-2">Documents</h4>
                <div className="space-y-2">
                  {syllabus.documents.map((doc, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                    >
                      <span className="text-sm">{doc} Syllabus</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => toast.success(`${doc} Syllabus downloaded`)}
                      >
                        <Download size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderPerformance = () => {
    return (
      <div className="space-y-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Subject Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#4f46e5" name="Your Score" />
                  <Bar dataKey="average" fill="#94a3b8" name="Class Average" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Performance Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Overall Grade</span>
                <Badge className="bg-green-100 text-green-800">A</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Rank in Class</span>
                <span className="font-medium">5 of 35</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Attendance</span>
                <span className="font-medium">95%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Assignment Completion</span>
                <span className="font-medium">92%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => toast.info("Detailed report feature coming soon")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Download Detailed Report
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <Layout title="Academics" showBackButton={true}>
      <div className="space-y-4 pb-20">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display">Academics</h1>
          <p className="text-muted-foreground">Track your academic progress</p>
        </div>
        
        <Tabs 
          defaultValue="subjects" 
          value={activeTab} 
          onValueChange={value => setActiveTab(value as typeof activeTab)}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-4 h-12">
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subjects" className="animate-in fade-in-50 duration-500">
            {renderSubjects()}
          </TabsContent>
          
          <TabsContent value="tests" className="animate-in fade-in-50 duration-500">
            {renderUpcomingTests()}
          </TabsContent>
          
          <TabsContent value="syllabus" className="animate-in fade-in-50 duration-500">
            {renderSyllabus()}
          </TabsContent>
          
          <TabsContent value="performance" className="animate-in fade-in-50 duration-500">
            {renderPerformance()}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Academics;
