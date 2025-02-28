
import { useState } from 'react';
import Layout from '../components/Layout';
import { CalendarIcon, Clock, FileText, Send } from 'lucide-react';
import { toast } from 'sonner';

const leaveTypes = [
  { id: 'sick', label: 'Sick Leave' },
  { id: 'family', label: 'Family Emergency' },
  { id: 'function', label: 'Function/Event' },
  { id: 'other', label: 'Other' }
];

const LeaveApplication = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [reason, setReason] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!fromDate || !toDate || !leaveType || !reason) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Submit form logic would go here
    console.log({ fromDate, toDate, leaveType, reason, attachment });
    
    // Show success message
    toast.success('Leave application submitted successfully');
    
    // Reset form
    setFromDate('');
    setToDate('');
    setLeaveType('');
    setReason('');
    setAttachment(null);
  };

  return (
    <Layout title="Apply Leave" showBackButton={true}>
      <div className="space-y-5">
        <div className="bg-white rounded-2xl p-5 border card-shadow">
          <h2 className="text-lg font-medium mb-3">Submit Leave Application</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Fill the form below to apply for leave. All fields marked with * are required.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  />
                  <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
            
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
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>
            
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
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Attachment (Optional)
              </label>
              <div className="border border-dashed rounded-lg p-4 text-center">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  {attachment ? attachment.name : 'Upload supporting document (if any)'}
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => e.target.files && setAttachment(e.target.files[0])}
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-muted text-sm font-medium rounded-lg cursor-pointer"
                >
                  Browse Files
                </label>
              </div>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-medium flex items-center justify-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Application
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border card-shadow">
          <h3 className="text-md font-medium mb-3">Leave History</h3>
          
          <div className="space-y-3">
            <div className="flex items-start p-3 rounded-xl border hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mr-3 mt-1">
                <Clock size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium text-sm">Sick Leave</p>
                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                </div>
                <p className="text-xs text-muted-foreground">May 15, 2023 - May 16, 2023</p>
                <p className="text-xs mt-1">Fever and cold</p>
              </div>
            </div>
            
            <div className="flex items-start p-3 rounded-xl border hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500 mr-3 mt-1">
                <Clock size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium text-sm">Family Function</p>
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Approved</span>
                </div>
                <p className="text-xs text-muted-foreground">April 10, 2023 - April 12, 2023</p>
                <p className="text-xs mt-1">Sister's wedding ceremony</p>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-4 text-center text-sm text-primary font-medium py-2 hover:underline">
            View All Applications
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveApplication;
