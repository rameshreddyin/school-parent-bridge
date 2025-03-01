
import { useState } from "react";
import { 
  FilePlus, 
  FileText, 
  FileCheck, 
  FileX, 
  Clock, 
  Calendar as CalendarIcon,
  Send
} from "lucide-react";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { studentData } from "../utils/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface PermissionRequest {
  id: string;
  type: string;
  title: string;
  startDate: Date;
  endDate?: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  response?: string;
}

// Mock permission request data
const permissionRequests: PermissionRequest[] = [
  {
    id: "PR001",
    type: "Leave Application",
    title: "Sick Leave",
    startDate: new Date(2023, 5, 10),
    endDate: new Date(2023, 5, 12),
    reason: "I am suffering from fever and have been advised rest by the doctor.",
    status: "approved",
    createdAt: new Date(2023, 5, 8),
    response: "Approved. Get well soon."
  },
  {
    id: "PR002",
    type: "Event Participation",
    title: "Inter-School Debate Competition",
    startDate: new Date(2023, 6, 15),
    reason: "I have been selected to represent our school in the inter-school debate competition.",
    status: "approved",
    createdAt: new Date(2023, 6, 10),
    response: "Approved. Congratulations and good luck!"
  },
  {
    id: "PR003",
    type: "Late Arrival",
    title: "Doctor's Appointment",
    startDate: new Date(2023, 7, 20),
    reason: "I have a doctor's appointment in the morning and will be arriving at school by 10:30 AM.",
    status: "pending",
    createdAt: new Date(2023, 7, 18)
  }
];

const Permission = () => {
  const { toast } = useToast();
  const [permissionType, setPermissionType] = useState("leave");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [reason, setReason] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      return toast({
        title: "Missing information",
        description: "Please enter a title for your request",
        variant: "destructive"
      });
    }
    
    if (!startDate) {
      return toast({
        title: "Missing information",
        description: "Please select a date",
        variant: "destructive"
      });
    }
    
    if (permissionType === "leave" && !endDate) {
      return toast({
        title: "Missing information",
        description: "Please select an end date for leave",
        variant: "destructive"
      });
    }
    
    if (!reason.trim()) {
      return toast({
        title: "Missing information",
        description: "Please provide a reason for your request",
        variant: "destructive"
      });
    }
    
    // Success notification
    toast({
      title: "Permission request submitted",
      description: "Your request has been sent to the school administration.",
    });
    
    // Reset form
    setTitle("");
    setStartDate(new Date());
    setEndDate(undefined);
    setReason("");
  };

  return (
    <Layout title="Permission Forms">
      <div className="space-y-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Permission Forms</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <FilePlus className="mr-2 h-4 w-4" />
                    New Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Submit Permission Request</DialogTitle>
                    <DialogDescription>
                      Fill in the details to request permission from the school.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="type">Request Type</Label>
                        <Tabs 
                          value={permissionType} 
                          onValueChange={setPermissionType}
                          className="w-full"
                        >
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="leave">Leave</TabsTrigger>
                            <TabsTrigger value="late">Late Arrival</TabsTrigger>
                            <TabsTrigger value="event">Event</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="E.g., Sick Leave, Doctor's Appointment"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>
                          {permissionType === "leave" 
                            ? "Leave Period" 
                            : permissionType === "late" 
                            ? "Date of Late Arrival" 
                            : "Event Date"}
                        </Label>
                        <div className="flex space-x-2">
                          <div className="flex-1 space-y-1">
                            <Label htmlFor="startDate" className="text-xs">From</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {startDate ? format(startDate, "PPP") : "Select date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={startDate}
                                  onSelect={setStartDate}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          {permissionType === "leave" && (
                            <div className="flex-1 space-y-1">
                              <Label htmlFor="endDate" className="text-xs">To</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(endDate, "PPP") : "Select date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    initialFocus
                                    disabled={(date) => (
                                      startDate ? date < startDate : false
                                    )}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Textarea
                          id="reason"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Please explain in detail..."
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Submit Request</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-4 space-y-4">
            {permissionRequests
              .filter(req => req.status === "pending")
              .map(request => (
                <Card key={request.id} className="border shadow-sm">
                  <CardContent className="p-0">
                    <div className="flex border-l-4 border-yellow-400">
                      <div className="flex-1 p-4">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{request.title}</h3>
                            <p className="text-xs text-muted-foreground">{request.type}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm">{request.reason}</p>
                          <div className="mt-2 flex items-center space-x-3 text-xs text-muted-foreground">
                            <span>
                              {format(request.startDate, "PPP")}
                              {request.endDate && ` to ${format(request.endDate, "PPP")}`}
                            </span>
                            <span>•</span>
                            <span>Submitted on {format(request.createdAt, "PPP")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 bg-muted/20">
                        <div className="text-center">
                          <div className="text-sm font-medium">Status</div>
                          <span className="inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                            Pending
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {permissionRequests.filter(req => req.status === "pending").length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">No active requests</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You don't have any pending permission requests at the moment.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="approved" className="mt-4 space-y-4">
            {permissionRequests
              .filter(req => req.status === "approved")
              .map(request => (
                <Card key={request.id} className="border shadow-sm">
                  <CardContent className="p-0">
                    <div className="flex border-l-4 border-green-400">
                      <div className="flex-1 p-4">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <FileCheck className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{request.title}</h3>
                            <p className="text-xs text-muted-foreground">{request.type}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm">{request.reason}</p>
                          <div className="mt-2 flex items-center space-x-3 text-xs text-muted-foreground">
                            <span>
                              {format(request.startDate, "PPP")}
                              {request.endDate && ` to ${format(request.endDate, "PPP")}`}
                            </span>
                            <span>•</span>
                            <span>Approved on {format(request.createdAt, "PPP")}</span>
                          </div>
                          {request.response && (
                            <div className="mt-3 rounded-md bg-muted/30 p-2 text-sm">
                              <p className="font-medium text-xs">Response:</p>
                              <p className="mt-1 text-sm">{request.response}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 bg-muted/20">
                        <div className="text-center">
                          <div className="text-sm font-medium">Status</div>
                          <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                            Approved
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {permissionRequests.filter(req => req.status === "approved").length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">No approved requests</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You don't have any approved permission requests yet.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rejected" className="mt-4 space-y-4">
            {permissionRequests
              .filter(req => req.status === "rejected")
              .map(request => (
                <Card key={request.id} className="border shadow-sm">
                  <CardContent className="p-0">
                    <div className="flex border-l-4 border-red-400">
                      <div className="flex-1 p-4">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                            <FileX className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{request.title}</h3>
                            <p className="text-xs text-muted-foreground">{request.type}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm">{request.reason}</p>
                          <div className="mt-2 flex items-center space-x-3 text-xs text-muted-foreground">
                            <span>
                              {format(request.startDate, "PPP")}
                              {request.endDate && ` to ${format(request.endDate, "PPP")}`}
                            </span>
                            <span>•</span>
                            <span>Rejected on {format(request.createdAt, "PPP")}</span>
                          </div>
                          {request.response && (
                            <div className="mt-3 rounded-md bg-muted/30 p-2 text-sm">
                              <p className="font-medium text-xs">Response:</p>
                              <p className="mt-1 text-sm">{request.response}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 bg-muted/20">
                        <div className="text-center">
                          <div className="text-sm font-medium">Status</div>
                          <span className="inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                            Rejected
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {permissionRequests.filter(req => req.status === "rejected").length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <FileX className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">No rejected requests</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You don't have any rejected permission requests.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="rounded-lg border border-dashed p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Send className="h-5 w-5 text-primary" />
          </div>
          <h3 className="mb-1 text-lg font-medium">Need Immediate Assistance?</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            For urgent matters, you can directly contact the school administration.
          </p>
          <Button variant="outline">Contact School</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Permission;
