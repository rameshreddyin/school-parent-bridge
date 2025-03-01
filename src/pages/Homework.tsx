
import { useState } from 'react';
import Layout from '../components/Layout';
import { Book, Calendar, CheckCircle, Clock, AlertCircle, ChevronRight, Upload, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Mock homework data
const homeworkData = [
  {
    id: 1,
    subject: 'Mathematics',
    title: 'Algebra Problems',
    description: 'Complete problems 1-15 from Chapter 5',
    dueDate: '2023-06-10',
    status: 'pending',
    priority: 'high',
    attachments: ['algebra_worksheet.pdf']
  },
  {
    id: 2,
    subject: 'Science',
    title: 'Lab Report',
    description: 'Write a lab report on the photosynthesis experiment',
    dueDate: '2023-06-15',
    status: 'submitted',
    submittedDate: '2023-06-09',
    priority: 'medium',
    attachments: ['lab_instructions.pdf'],
    grade: 'A'
  },
  {
    id: 3,
    subject: 'English',
    title: 'Essay',
    description: 'Write a 500-word essay on the theme of identity in the novel',
    dueDate: '2023-06-12',
    status: 'pending',
    priority: 'medium',
    attachments: ['essay_rubric.pdf']
  },
  {
    id: 4,
    subject: 'History',
    title: 'Research Project',
    description: 'Research and create a presentation on a historical figure',
    dueDate: '2023-06-20',
    status: 'pending',
    priority: 'low',
    attachments: ['project_guidelines.pdf']
  },
  {
    id: 5,
    subject: 'Computer Science',
    title: 'Coding Exercise',
    description: 'Implement a simple calculator using JavaScript',
    dueDate: '2023-06-08',
    status: 'late',
    priority: 'high',
    attachments: ['coding_instructions.pdf']
  }
];

// Completed homework
const completedHomework = homeworkData.filter(hw => hw.status === 'submitted');
const pendingHomework = homeworkData.filter(hw => hw.status === 'pending' || hw.status === 'late');

const Homework = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [selectedHomework, setSelectedHomework] = useState<typeof homeworkData[0] | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleHomeworkClick = (homework: typeof homeworkData[0]) => {
    setSelectedHomework(homework);
    setDetailsOpen(true);
  };
  
  const handleSubmit = (homework: typeof homeworkData[0]) => {
    setSelectedHomework(homework);
    setUploadDialogOpen(true);
  };
  
  const simulateFileUpload = () => {
    if (!selectedHomework || !selectedFile) return;
    
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Uploading homework...',
        success: 'Homework submitted successfully!',
        error: 'Failed to upload homework.'
      }
    );
    
    setUploadDialogOpen(false);
    setSelectedFile(null);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-none">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-none">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-none">Low</Badge>;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-green-100 text-green-800 border-none">Submitted</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800 border-none">Pending</Badge>;
      case 'late':
        return <Badge className="bg-red-100 text-red-800 border-none">Late</Badge>;
      default:
        return null;
    }
  };
  
  const renderPendingHomework = () => {
    return (
      <div className="space-y-3">
        {pendingHomework.map(homework => (
          <Card key={homework.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{homework.title}</h3>
                  <p className="text-sm text-muted-foreground">{homework.subject}</p>
                </div>
                <div className="flex space-x-2">
                  {getPriorityBadge(homework.priority)}
                  {getStatusBadge(homework.status)}
                </div>
              </div>
              
              <p className="text-sm mt-2 line-clamp-2">{homework.description}</p>
              
              <div className="mt-3 flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Due: {new Date(homework.dueDate).toLocaleDateString()}</span>
                
                {homework.status === 'late' && (
                  <span className="ml-2 text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Overdue
                  </span>
                )}
              </div>
              
              <div className="mt-3 flex justify-between">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => handleHomeworkClick(homework)}
                >
                  View Details
                </Button>
                
                <Button 
                  size="sm"
                  onClick={() => handleSubmit(homework)}
                >
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {pendingHomework.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
            <p className="text-lg font-medium">All caught up!</p>
            <p className="text-sm text-muted-foreground">You have no pending homework.</p>
          </div>
        )}
      </div>
    );
  };
  
  const renderCompletedHomework = () => {
    return (
      <div className="space-y-3">
        {completedHomework.map(homework => (
          <Card key={homework.id} className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{homework.title}</h3>
                  <p className="text-sm text-muted-foreground">{homework.subject}</p>
                </div>
                {homework.grade && (
                  <Badge className="bg-green-100 text-green-800 border-none">
                    Grade: {homework.grade}
                  </Badge>
                )}
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Submitted: {new Date(homework.submittedDate as string).toLocaleDateString()}</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleHomeworkClick(homework)}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {completedHomework.length === 0 && (
          <div className="text-center py-8">
            <Book className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-medium">No completed homework</p>
            <p className="text-sm text-muted-foreground">Your completed assignments will appear here.</p>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Layout title="Homework" showBackButton={true}>
      <div className="space-y-4 pb-20">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display">Homework</h1>
          <p className="text-muted-foreground">View and submit your assignments</p>
        </div>
        
        <Tabs 
          defaultValue="pending" 
          value={activeTab} 
          onValueChange={value => setActiveTab(value as typeof activeTab)}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-2 h-12">
            <TabsTrigger value="pending">
              Pending
              {pendingHomework.length > 0 && (
                <span className="ml-1.5 bg-primary text-white text-xs rounded-full h-5 min-w-5 inline-flex items-center justify-center px-1.5">
                  {pendingHomework.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="animate-in fade-in-50 duration-500">
            {renderPendingHomework()}
          </TabsContent>
          
          <TabsContent value="completed" className="animate-in fade-in-50 duration-500">
            {renderCompletedHomework()}
          </TabsContent>
        </Tabs>
        
        {/* Homework Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Assignment Details</DialogTitle>
            </DialogHeader>
            
            {selectedHomework && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">{selectedHomework.title}</h2>
                  <p className="text-sm text-muted-foreground">{selectedHomework.subject}</p>
                </div>
                
                <div className="flex space-x-2">
                  {getPriorityBadge(selectedHomework.priority)}
                  {getStatusBadge(selectedHomework.status)}
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Description</h3>
                  <p className="text-sm">{selectedHomework.description}</p>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Due Date: {new Date(selectedHomework.dueDate).toLocaleDateString()}</span>
                </div>
                
                {selectedHomework.submittedDate && (
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    <span>Submitted: {new Date(selectedHomework.submittedDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                {selectedHomework.attachments && selectedHomework.attachments.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Attachments</h3>
                    {selectedHomework.attachments.map((attachment, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                      >
                        <span className="text-sm">{attachment}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8"
                          onClick={() => toast.success(`Downloaded ${attachment}`)}
                        >
                          <ExternalLink size={14} className="mr-1" />
                          Open
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedHomework.status !== 'submitted' && (
                  <Button 
                    className="w-full"
                    onClick={() => {
                      setDetailsOpen(false);
                      setUploadDialogOpen(true);
                    }}
                  >
                    Submit Assignment
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Assignment</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedHomework && (
                <div>
                  <h3 className="text-base font-medium">{selectedHomework.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedHomework.subject}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload File</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {selectedFile ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        Change File
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop your file here, or click to browse
                      </p>
                      <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        Browse Files
                      </Button>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                </p>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setUploadDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  disabled={!selectedFile}
                  onClick={simulateFileUpload}
                >
                  Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Homework;
