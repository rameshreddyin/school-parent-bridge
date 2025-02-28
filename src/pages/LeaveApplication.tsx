
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { CalendarIcon, Clock, FileText, Send, X, Check, AlertCircle, ChevronDown, Calendar, AlertTriangle, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const leaveTypes = [
  { id: 'sick', label: 'Sick Leave', requiresDocuments: true },
  { id: 'family', label: 'Family Emergency', requiresDocuments: false },
  { id: 'function', label: 'Function/Event', requiresDocuments: false },
  { id: 'medical', label: 'Medical Appointment', requiresDocuments: true },
  { id: 'religious', label: 'Religious Festival', requiresDocuments: false },
  { id: 'travel', label: 'Travel', requiresDocuments: false },
  { id: 'other', label: 'Other', requiresDocuments: false }
];

interface LeaveHistoryItem {
  id: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  fromDate: string;
  toDate: string;
  reason: string;
  appliedOn: string;
  actionDate?: string;
  actionBy?: string;
  comments?: string;
}

const mockLeaveHistory: LeaveHistoryItem[] = [
  {
    id: "L001",
    type: "Sick Leave",
    status: "pending",
    fromDate: "2023-05-15",
    toDate: "2023-05-16",
    reason: "Fever and cold",
    appliedOn: "2023-05-14"
  },
  {
    id: "L002",
    type: "Family Function",
    status: "approved",
    fromDate: "2023-04-10",
    toDate: "2023-04-12",
    reason: "Sister's wedding ceremony",
    appliedOn: "2023-04-01",
    actionDate: "2023-04-03",
    actionBy: "Principal",
    comments: "Approved. Please ensure homework is completed."
  },
  {
    id: "L003",
    type: "Medical Appointment",
    status: "rejected",
    fromDate: "2023-03-05",
    toDate: "2023-03-05",
    reason: "Dental checkup",
    appliedOn: "2023-03-01",
    actionDate: "2023-03-02",
    actionBy: "Class Teacher",
    comments: "Please reschedule to after school hours."
  }
];

const LeaveApplication = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [reason, setReason] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [notifyTeacher, setNotifyTeacher] = useState(true);
  const [submitMode, setSubmitMode] = useState<'default' | 'preview'>('default');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'apply' | 'history'>('apply');
  const [expandedLeaveId, setExpandedLeaveId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Track scroll position for UI effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Calculate leave duration
  const calculateDuration = () => {
    if (!fromDate || !toDate) return 0;
    
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return diffDays;
  };
  
  const leaveDuration = calculateDuration();
  
  const handleAttachmentAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };
  
  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  
  const selectedLeaveTypeRequiresDocuments = () => {
    const selected = leaveTypes.find(type => type.id === leaveType);
    return selected?.requiresDocuments || false;
  };
  
  const validateForm = () => {
    if (!fromDate) {
      toast.error('Please select a start date');
      return false;
    }
    
    if (!toDate) {
      toast.error('Please select an end date');
      return false;
    }
    
    if (new Date(fromDate) > new Date(toDate)) {
      toast.error('End date cannot be before start date');
      return false;
    }
    
    if (!leaveType) {
      toast.error('Please select a leave type');
      return false;
    }
    
    if (!reason.trim()) {
      toast.error('Please provide a reason for leave');
      return false;
    }
    
    if (reason.trim().length < 10) {
      toast.error('Please provide a more detailed reason (min 10 characters)');
      return false;
    }
    
    if (selectedLeaveTypeRequiresDocuments() && attachments.length === 0) {
      toast.error('This leave type requires supporting documents');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (submitMode === 'default') {
      setSubmitMode('preview');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Submit logic
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Submit form logic would go here
      console.log({ 
        fromDate, 
        toDate, 
        leaveType, 
        reason, 
        notifyTeacher,
        attachments
      });
      
      // Show success message
      toast.success('Leave application submitted successfully');
      
      // Reset form
      setFromDate('');
      setToDate('');
      setLeaveType('');
      setReason('');
      setAttachments([]);
      setNotifyTeacher(true);
      setSubmitMode('default');
      setSubmitting(false);
      setActiveTab('history');
    }, 1500);
  };
  
  const cancelPreview = () => {
    setSubmitMode('default');
  };
  
  const simulateRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Leave history updated');
    }, 1500);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric',
      month: 'short', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };
  
  const getStatusColor = (status: LeaveHistoryItem['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  const getStatusIcon = (status: LeaveHistoryItem['status']) => {
    switch (status) {
      case 'approved':
        return <Check size={14} />;
      case 'rejected':
        return <X size={14} />;
      case 'pending':
      default:
        return <Clock size={14} />;
    }
  };
  
  const toggleExpandLeave = (id: string) => {
    if (expandedLeaveId === id) {
      setExpandedLeaveId(null);
    } else {
      setExpandedLeaveId(id);
    }
  };

  return (
    <Layout title="Leave" showBackButton={true}>
      <div className="relative">
        {/* Tab Navigation - Fixed at top */}
        <div className="bg-white rounded-xl flex overflow-hidden border mb-3 sticky top-0 z-10">
          <button 
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'apply' ? 'bg-primary text-white' : 'hover:bg-muted/50'}`}
            onClick={() => setActiveTab('apply')}
          >
            Apply
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'history' ? 'bg-primary text-white' : 'hover:bg-muted/50'}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
        
        {activeTab === 'apply' && (
          <>
            {submitMode === 'preview' ? (
              <div className="bg-white rounded-xl p-4 border card-shadow animate-fade-in">
                <h2 className="text-lg font-medium mb-2">Review Application</h2>
                <p className="text-xs text-muted-foreground mb-3">
                  Please confirm these details before submitting.
                </p>
                
                <div className="space-y-3 bg-muted/20 p-3 rounded-lg border">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Leave Type</p>
                      <p className="font-medium text-sm">
                        {leaveTypes.find(type => type.id === leaveType)?.label || leaveType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-medium text-sm">{leaveDuration} day(s)</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="font-medium text-sm">{formatDate(fromDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">To</p>
                      <p className="font-medium text-sm">{formatDate(toDate)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Reason</p>
                    <p className="text-sm">{reason}</p>
                  </div>
                  
                  {attachments.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Attachments</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {attachments.map((file, index) => (
                          <div key={index} className="bg-muted/50 px-2 py-1 rounded-md text-xs flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            <span className="truncate max-w-[100px]">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center text-xs p-2 bg-amber-50 rounded-lg">
                    <AlertCircle size={14} className="text-amber-500 mr-2 flex-shrink-0" />
                    <p>
                      {notifyTeacher 
                        ? "Your child's class teacher will be notified."
                        : "You've chosen not to notify the class teacher."}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={cancelPreview}
                    className="flex-1 bg-muted py-3 rounded-xl font-medium text-sm"
                    disabled={submitting}
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-medium flex items-center justify-center text-sm"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-4 border card-shadow animate-fade-in">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Type of Leave *
                    </label>
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      className="w-full mt-1 rounded-lg border p-3 text-sm"
                      required
                    >
                      <option value="">Select leave type</option>
                      {leaveTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.label} {type.requiresDocuments ? '(Docs Required)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">
                        From Date *
                      </label>
                      <div className="relative mt-1">
                        <input
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          className="w-full rounded-lg border p-3 pl-9 text-sm"
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">
                        To Date *
                      </label>
                      <div className="relative mt-1">
                        <input
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          className="w-full rounded-lg border p-3 pl-9 text-sm"
                          required
                          min={fromDate || new Date().toISOString().split('T')[0]}
                        />
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  {fromDate && toDate && (
                    <div className="bg-primary/5 p-2 rounded-lg flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      Duration: <span className="font-semibold ml-1">{leaveDuration} day(s)</span>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium">
                      Reason *
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full mt-1 rounded-lg border p-3 text-sm min-h-[80px] resize-none"
                      placeholder="Why are you applying for leave?"
                      required
                    ></textarea>
                    <p className="text-xs text-muted-foreground mt-1">
                      Min 10 characters. Add details to help process your request faster.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium flex items-center">
                        Attachment
                        {selectedLeaveTypeRequiresDocuments() && (
                          <span className="ml-1 text-xs px-1.5 py-0.5 bg-red-50 text-red-500 rounded">Required</span>
                        )}
                      </label>
                      <span className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 5MB)</span>
                    </div>
                    
                    <div className="border border-dashed rounded-lg p-3 mt-1 text-center">
                      {attachments.length > 0 ? (
                        <div className="space-y-2">
                          {attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-muted/30 p-2 rounded-lg">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                              </div>
                              <button 
                                type="button"
                                onClick={() => handleRemoveAttachment(index)}
                                className="p-1 hover:bg-muted rounded-full"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                          <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleAttachmentAdd}
                            multiple
                          />
                          <label
                            htmlFor="file-upload"
                            className="inline-flex items-center px-3 py-2 bg-muted text-xs font-medium rounded-lg cursor-pointer mt-2"
                          >
                            <Plus size={14} className="mr-1" />
                            Add More Files
                          </label>
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleAttachmentAdd}
                            multiple
                          />
                          <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center cursor-pointer w-full py-3"
                          >
                            <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">Tap to upload documents</span>
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-teacher"
                      checked={notifyTeacher}
                      onChange={() => setNotifyTeacher(!notifyTeacher)}
                      className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                    />
                    <label htmlFor="notify-teacher" className="text-sm ml-2">
                      Notify class teacher about this leave
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-xl font-medium flex items-center justify-center text-sm"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Preview Application
                  </button>
                </form>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'history' && (
          <>
            <div className="bg-white rounded-xl p-4 border card-shadow animate-fade-in">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-medium">Leave History</h3>
                <button 
                  onClick={simulateRefresh}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-primary' : ''}`} />
                </button>
              </div>
              
              {mockLeaveHistory.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <p className="mt-2 text-sm text-muted-foreground">No leave applications found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockLeaveHistory.map((leave) => (
                    <div 
                      key={leave.id}
                      className="rounded-xl border hover:border-primary/20 transition-colors overflow-hidden"
                    >
                      <div 
                        className="flex items-start p-3 cursor-pointer"
                        onClick={() => toggleExpandLeave(leave.id)}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          leave.status === 'approved' ? 'bg-green-50 text-green-500' : 
                          leave.status === 'rejected' ? 'bg-red-50 text-red-500' : 
                          'bg-amber-50 text-amber-500'
                        }`}>
                          {leave.status === 'approved' ? <Check size={18} /> : 
                          leave.status === 'rejected' ? <X size={18} /> : 
                          <Clock size={18} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium text-sm">{leave.type}</p>
                            <div className="flex items-center">
                              <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(leave.status)}`}>
                                <span className="capitalize">{leave.status}</span>
                              </span>
                              <ChevronDown 
                                size={16} 
                                className={`ml-1 transition-transform ${expandedLeaveId === leave.id ? 'rotate-180' : ''}`} 
                              />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(leave.fromDate)} {leave.fromDate !== leave.toDate && `- ${formatDate(leave.toDate)}`}
                          </p>
                          <p className="text-xs mt-1 line-clamp-1">{leave.reason}</p>
                        </div>
                      </div>
                      
                      {expandedLeaveId === leave.id && (
                        <div className="px-3 pb-3 pt-1 border-t border-dashed ml-12 text-sm space-y-3 animate-fade-in">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground">Applied On:</p>
                              <p>{formatDate(leave.appliedOn)}</p>
                            </div>
                            {leave.actionDate && (
                              <div>
                                <p className="text-muted-foreground">Action Date:</p>
                                <p>{formatDate(leave.actionDate)}</p>
                              </div>
                            )}
                          </div>
                          
                          {leave.actionBy && (
                            <div className="text-xs">
                              <p className="text-muted-foreground">Action By:</p>
                              <p>{leave.actionBy}</p>
                            </div>
                          )}
                          
                          {leave.comments && (
                            <div className="text-xs bg-muted/20 p-2 rounded-lg">
                              <p className="text-muted-foreground mb-1">Comments:</p>
                              <p className="italic">{leave.comments}</p>
                            </div>
                          )}
                          
                          {leave.status === 'pending' && (
                            <div className="flex justify-end">
                              <button className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg">
                                Cancel Application
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Floating Action Button */}
            <button 
              onClick={() => setActiveTab('apply')}
              className="fixed bottom-20 right-4 w-12 h-12 bg-primary text-white rounded-full shadow-lg flex items-center justify-center"
              aria-label="New leave application"
            >
              <Plus size={24} />
            </button>
          </>
        )}
      </div>
    </Layout>
  );
};

export default LeaveApplication;
