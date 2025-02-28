
import { useState } from 'react';
import Layout from '../components/Layout';
import { CalendarIcon, Clock, FileText, Send, X, Check, AlertCircle, ChevronDown, Calendar } from 'lucide-react';
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
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
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
    <Layout title="Apply Leave" showBackButton={true}>
      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl flex overflow-hidden border">
          <button 
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'apply' ? 'bg-primary text-white' : 'hover:bg-muted/50'}`}
            onClick={() => setActiveTab('apply')}
          >
            Apply for Leave
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'history' ? 'bg-primary text-white' : 'hover:bg-muted/50'}`}
            onClick={() => setActiveTab('history')}
          >
            Leave History
          </button>
        </div>
        
        {activeTab === 'apply' && (
          <>
            {submitMode === 'preview' ? (
              <div className="bg-white rounded-2xl p-5 border card-shadow animate-fade-in">
                <h2 className="text-lg font-medium mb-3">Review Leave Application</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Please review your leave application details before submitting.
                </p>
                
                <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Leave Type</p>
                      <p className="font-medium">
                        {leaveTypes.find(type => type.id === leaveType)?.label || leaveType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-medium">{leaveDuration} day(s)</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">From Date</p>
                      <p className="font-medium">{formatDate(fromDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">To Date</p>
                      <p className="font-medium">{formatDate(toDate)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Reason for Leave</p>
                    <p className="text-sm">{reason}</p>
                  </div>
                  
                  {attachments.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Attachments</p>
                      <ul className="text-sm list-disc list-inside">
                        {attachments.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex items-center pt-2">
                    <AlertCircle size={16} className="text-amber-500 mr-2" />
                    <p className="text-xs">
                      {notifyTeacher 
                        ? "Your child's class teacher will be notified about this leave."
                        : "You've chosen not to notify the class teacher."}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={cancelPreview}
                    className="flex-1 bg-muted py-3 rounded-xl font-medium text-sm"
                    disabled={submitting}
                  >
                    Edit Application
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-medium flex items-center justify-center text-sm"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Confirm & Submit
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-5 border card-shadow animate-fade-in">
                <h2 className="text-lg font-medium mb-3">Submit Leave Application</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Fill the form below to apply for leave. All fields marked with * are required.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Type of Leave *
                    </label>
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      className="w-full rounded-lg border p-2.5 text-sm"
                      required
                    >
                      <option value="">Select leave type</option>
                      {leaveTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.label} {type.requiresDocuments ? '(Requires Documents)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        From Date *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          className="w-full rounded-lg border p-2.5 pl-10 text-sm"
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                        <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        To Date *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          className="w-full rounded-lg border p-2.5 pl-10 text-sm"
                          required
                          min={fromDate || new Date().toISOString().split('T')[0]}
                        />
                        <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  {fromDate && toDate && (
                    <div className="bg-muted/30 p-3 rounded-lg flex items-center text-sm">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      Leave Duration: <span className="font-semibold ml-1">{leaveDuration} day(s)</span>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Reason for Leave *
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full rounded-lg border p-2.5 text-sm min-h-[100px] resize-none"
                      placeholder="Please provide detailed reason for the leave"
                      required
                    ></textarea>
                    <p className="text-xs text-muted-foreground">
                      Minimum 10 characters required. Include relevant details to help process your request faster.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      Attachment {selectedLeaveTypeRequiresDocuments() && <span className="text-red-500 ml-1">*</span>}
                      {selectedLeaveTypeRequiresDocuments() && (
                        <span className="text-xs text-red-500 ml-2">(Required for this leave type)</span>
                      )}
                    </label>
                    <div className="border border-dashed rounded-lg p-4 text-center">
                      {attachments.length > 0 ? (
                        <div className="space-y-2">
                          {attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-lg">
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
                            className="inline-block px-4 py-2 bg-muted text-sm font-medium rounded-lg cursor-pointer mt-2"
                          >
                            Add More Files
                          </label>
                        </div>
                      ) : (
                        <>
                          <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Upload supporting documents
                          </p>
                          <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleAttachmentAdd}
                            multiple
                          />
                          <label
                            htmlFor="file-upload"
                            className="inline-block px-4 py-2 bg-muted text-sm font-medium rounded-lg cursor-pointer"
                          >
                            Browse Files
                          </label>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Accepted file types: PDF, JPG, PNG. Max size: 5MB per file.
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyTeacher}
                        onChange={() => setNotifyTeacher(!notifyTeacher)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm">Notify class teacher about this leave</span>
                    </label>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-primary text-white py-3 rounded-xl font-medium flex items-center justify-center"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Preview Application
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl p-5 border card-shadow animate-fade-in">
            <h3 className="text-lg font-medium mb-3">Leave History</h3>
            
            {mockLeaveHistory.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-2 text-muted-foreground">No leave applications found</p>
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
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 mt-1 ${
                        leave.status === 'approved' ? 'bg-green-50 text-green-500' : 
                        leave.status === 'rejected' ? 'bg-red-50 text-red-500' : 
                        'bg-amber-50 text-amber-500'
                      }`}>
                        <Clock size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm">{leave.type}</p>
                          <div className="flex items-center">
                            <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(leave.status)}`}>
                              {getStatusIcon(leave.status)}
                              <span className="capitalize">{leave.status}</span>
                            </span>
                            <ChevronDown 
                              size={16} 
                              className={`ml-1 transition-transform ${expandedLeaveId === leave.id ? 'rotate-180' : ''}`} 
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(leave.fromDate).toLocaleDateString('en-IN')} - {new Date(leave.toDate).toLocaleDateString('en-IN')}
                        </p>
                        <p className="text-xs mt-1 line-clamp-1">{leave.reason}</p>
                      </div>
                    </div>
                    
                    {expandedLeaveId === leave.id && (
                      <div className="px-3 pb-3 pt-0 border-t border-dashed mt-1 ml-16 text-sm space-y-2 animate-fade-in">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">Applied On:</p>
                            <p>{new Date(leave.appliedOn).toLocaleDateString('en-IN')}</p>
                          </div>
                          {leave.actionDate && (
                            <div>
                              <p className="text-muted-foreground">Action Date:</p>
                              <p>{new Date(leave.actionDate).toLocaleDateString('en-IN')}</p>
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
                          <div className="text-xs">
                            <p className="text-muted-foreground">Comments:</p>
                            <p className="italic">{leave.comments}</p>
                          </div>
                        )}
                        
                        {leave.status === 'pending' && (
                          <div className="flex justify-end pt-1">
                            <button className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-lg">
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
        )}
        
        {activeTab === 'history' && (
          <div className="text-center">
            <button 
              onClick={() => setActiveTab('apply')} 
              className="inline-flex items-center justify-center bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium"
            >
              <Send className="h-4 w-4 mr-2" />
              Apply for New Leave
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LeaveApplication;
