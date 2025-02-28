
import { Fee } from '../utils/mockData';
import { CreditCard, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface FeePaymentProps {
  fees: Fee[];
}

const FeePayment = ({ fees }: FeePaymentProps) => {
  const pendingFees = fees.filter(fee => fee.status === 'pending' || fee.status === 'overdue');
  const totalPending = pendingFees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidFees = fees.filter(fee => fee.status === 'paid');
  
  const getStatusIcon = (status: Fee['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-amber-600" />;
      case 'overdue':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };
  
  const getStatusClass = (status: Fee['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };
  
  return (
    <div className="bg-white rounded-2xl card-shadow p-5 border animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Fees & Payments</h3>
        <div className="bg-primary/10 text-primary rounded-full p-1.5">
          <CreditCard size={18} />
        </div>
      </div>
      
      {pendingFees.length > 0 && (
        <div className="bg-muted rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Pending Amount</p>
              <p className="text-2xl font-semibold">₹{totalPending.toLocaleString('en-IN')}</p>
            </div>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Pay Now
            </button>
          </div>
        </div>
      )}
      
      <h4 className="text-sm font-medium mb-2">Recent Payments</h4>
      <div className="space-y-2 max-h-[300px] overflow-y-auto subtle-scroll">
        {fees.map((fee) => {
          return (
            <div 
              key={fee.id}
              className="p-3 rounded-xl border hover:border-primary/30 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-sm">{fee.type}</h5>
                  <p className="text-lg font-semibold">₹{fee.amount.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusClass(fee.status)}`}>
                    {getStatusIcon(fee.status)}
                    <span className="ml-1 capitalize">{fee.status}</span>
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {fee.status === 'paid' 
                      ? `Paid on ${new Date(fee.paidOn!).toLocaleDateString('en-IN')}` 
                      : `Due on ${new Date(fee.dueDate).toLocaleDateString('en-IN')}`}
                  </span>
                </div>
              </div>
              
              {fee.status === 'paid' && fee.receiptNo && (
                <div className="flex justify-end mt-3">
                  <button className="text-xs text-primary hover:underline inline-flex items-center">
                    <Download size={12} className="mr-1" />
                    Download Receipt
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 text-center text-sm text-primary font-medium py-2 hover:underline">
        View Payment History
      </button>
    </div>
  );
};

export default FeePayment;
